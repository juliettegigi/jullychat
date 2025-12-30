const jwt = require('jsonwebtoken');
const {Op,Sequelize} = require('sequelize');

const {User, Contacto, sequelize, Mensaje, Chat} = require('../models');

const usuariosConectados = new Map();  // 🔴 mapa global usuarioId → socketId

const socketController=(socket) => {
  console.log('🔌 Usuario conectado:', socket.id);



   // ⬇️ ⬇️ ⬇️  AQUI METÉS EL CÓDIGO DEL TOKEN  ⬇️ ⬇️ ⬇️
    try {
        const { token } = socket.handshake.auth;

        if (!token) {
            console.log("❌ Socket sin token");
            return socket.disconnect();
        }

        const { userId } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Guardar el userId dentro del socket
        socket.userId = userId;

        // Registrar usuario como conectado
        usuariosConectados.set(userId, socket.id);

        console.log("✔ Usuario conectado (auth):", userId);

        socket.on("disconnect", () => {
            usuariosConectados.delete(userId);
            console.log("❌ Usuario desconectado:", userId);
        });

    } catch (error) {
        console.log("❌ Error autenticando socket:", error);
        return socket.disconnect();
    }
    // ⬆️ ⬆️ ⬆️  FIN CÓDIGO TOKEN  ⬆️ ⬆️ ⬆️






  socket.on('mensaje', (msg) => {
    console.log('📩 Mensaje recibido:', msg);
    io.emit('mensaje', msg); // reenvía a todos
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });

  socket.on('logueame',({email,pass})=>{ //el cliente me va a decir "logueame"
         console.log("de verasss? ")
         //busco en la base de datos un usuario con ese email y pass  
         User.findOne({where:{email,pass}}).then(user=>{
             if(user){ //si lo encuentra
                 console.log(user)
                 console.log("lo encontreeeeee")
                 socket.emit('logueado',user) //le digo al cliente que se ha logueado
             }else{
                 socket.emit('logueado',null) //le digo al cliente que no se ha logueado
             }
         }).catch(err=>{
             console.log(err)
             socket.emit('logueado',null) //le digo al cliente que no se ha logueado
         })        
  })


    socket.on('buscarUsuarios', async({termino,limit=5,offset=0}) => {
          try {
            //termino puede ser un email o userName
            
            let where = {};
            if (termino !== "") {
                 where = {
                   [Op.or]: [ { userName: { [Op.like]: `%${termino}%` }},            
                              { email: { [Op.like]: `%${termino}%` }},
                              Sequelize.where(  Sequelize.fn('levenshtein', 
                                                              Sequelize.col('User.userName'), 
                                                              termino),
                                                { [Op.lte]: 6 }
                                             ),               
                              Sequelize.where(  Sequelize.fn('levenshtein', 
                                                             Sequelize.col('email'), 
                                                             termino),
                                                { [Op.lte]: 6 }
                                       ),
                            ],
                 };
            }
    
            const exactMatchFirst = Sequelize.literal(`
                      CASE
                        WHEN LOWER(\`User\`.\`userName\`) = LOWER('${termino}') THEN 0
                        WHEN LOWER(\`User\`.\`email\`) = LOWER('${termino}') THEN 0
                        ELSE 1
                      END
                    `);
        const orderByLikeMatch = Sequelize.literal(`
                      CASE
                        WHEN \`User\`.\`userName\` LIKE '%${termino}%' THEN 0
                        WHEN \`User\`.\`email\` LIKE '%${termino}%' THEN 0
                        ELSE 1
                      END
                    `);            
        const orderByDistance = Sequelize.literal(`
                LEAST(
                  levenshtein(LOWER(\`User\`.\`userName\`), LOWER('${termino}')),
                  levenshtein(LOWER(\`User\`.\`email\`), LOWER('${termino}'))
                )
              `);


    
        
    
        // Realizar la consulta con las condiciones de búsqueda
        const usuarios = await User.findAndCountAll({
          where,
          attributes: { exclude: ['pass'] },
          order: [
            [exactMatchFirst, 'ASC'],
            [orderByLikeMatch, 'ASC'],
            [orderByDistance, 'ASC'],
            ['userName', 'ASC'],
            ['email', 'ASC'],
          ],
          limit,
          offset,
          distinct: true
        });
    
      
         socket.emit("usuariosEncontrados" ,usuarios); 
      } catch (error) {
        console.log('models==>usuario');
        throw error;
      }      
    });





      socket.on('agregameEsteContacto',async({contactoId,userId})=>{ 
        try{
         console.log("de verasss? ")
         const nuevoContacto=await Contacto.create({contactoId,userId}) 
          socket.emit('contactoAgregado',nuevoContacto) //le digo al cliente que se ha logueado
        }catch(err){
             console.log(err)
             socket.emit('contactoAgregado',null) //le digo al cliente que no se ha logueado
         }
  })



        socket.on('mensajeEmisor',async({ChatId,contenido})=>{ 
        try{
        const emisorId = socket.userId;
        // Buscar chat para saber quién es el receptor
        const chat = await Chat.findByPk(ChatId);
        console.log("CHAT ID -----------< ",ChatId )
        if (!chat) return;
        console.log("chat.user2Id -----------< ",chat.user2Id)
        console.log("chat.user1Id -----------< ",chat.user1Id)
        console.log("emisorIdd -----------< ",emisorId)
        const receptorId = 
                chat.user1Id === emisorId ? chat.user2Id : chat.user1Id;

         const nuevoMensaje=await Mensaje.create({emisorId,ChatId,contenido}) 
         // 🔹 Enviar al emisor, solo se emite al socket que envió el mensaje
         socket.emit('mensajeReceptor', nuevoMensaje);
         // 🔹 Enviar al receptor (si está conectado)SOLO se emite al socket del receptor 
        const socketReceptor = usuariosConectados.get(receptorId);
        if (socketReceptor) {
          console.log("por emitir mensajeReceptor toooo")
                socket.to(socketReceptor).emit('mensajeReceptor', nuevoMensaje);
            }
        }catch(err){
             console.log(err)
             socket.emit('mensajeReceptor',null) 
         }
  })

}



 module.exports = {
     socketController
 }
 