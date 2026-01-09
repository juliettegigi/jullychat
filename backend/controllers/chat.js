const { Op } = require('sequelize');
const { Mensaje ,User,Chat} = require('../models');
const { patch } = require('../app');


const getChatsByMsgContacto = async (req, res) => {
  try {
    console.log("GET CHATS BY MSG CONTACTO");
    const { limit, offset,termino } = req.query;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: [
        // Incluimos ambos usuarios
        {
          model: User,
          as: "usuario1",
          required: false,
          where: {
            id: { [Op.ne]: req.user.id }, // solo si no es el usuario logueado
            [Op.or]: [
              { userName: { [Op.like]: `%${termino}%` } },
              { email: { [Op.like]: `%${termino}%` } }
            ]
          }
        },
        {
          model: User,
          as: "usuario2",
          required: false,
          where: {
            id: { [Op.ne]: req.user.id }, // solo si no es el usuario logueado
            [Op.or]: [
              { userName: { [Op.like]: `%${termino}%` } },
              { email: { [Op.like]: `%${termino}%` } }
            ]
          }
        },
        {
          model: Mensaje,
          required: false,
          where: {
            contenido: { [Op.like]: `%${termino}%` }
          }
        }
      ],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });

    res.json(chats);
  } catch (error) {
    console.error("❌ Error en getChatsByMsgContacto:", error);
    res.status(500).json({ msg: "Error al buscar chats" });
  }
};

/* const postContacto=async(req,res)=>{
 
    try {
        console.log("POST CONTACTO")
        await Contacto.create({userId:req.user.id,contactoId:req.body.contactoId})

        res.status(201).json({msg:"Post. Contacto agregado. "})
            
    } catch (error) {
        console.log("ERROR en postContacto: ",error)
        res.status(400).json({error})
    }
} */


getChatCon = async (req, res) => {
  try {

    console.log("controller -->> chat -->> getChatCon");
    const user1Id = req.user.id; // usuario logueado (lo sacás del token o sesión)
    const { user2Id } = req.query; // id del otro usuario con el que se quiere chatear

  
    if (!user2Id) {
      return res.status(400).json({ msg: "Falta el user2Id en la query de la petición" });
    }
    else{
      // user2Id tiene que existir en la  base de datos
      const user2 = await User.findByPk(user2Id);
      if(!user2){
        return res.status(400).json({ msg: "El user2Id no corresponde a un usuario existente" });
      }
    }

    // 1️⃣ Busco si existe un chat entre ambos usuarios (en cualquier orden)
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id } // por si el orden es inverso
        ]
      }
    });
       // nunca intercambiaron mensajes los usuarios implicados
       if(!chat){
        return res.status(200).json({chat:null,mensajes:[]});
       }

      

    // 3️⃣ Si existe, busco todos los mensajes asociados a ese chat
    const mensajes = await Mensaje.findAll({
      where: { chatId: chat.id },
      order: [['createdAt', 'ASC']], // mensajes ordenados por fecha
    });

    // 4️⃣ Retorno el chat y los mensajes
    return res.status(200).json({
      msg: "Chat encontrado",
      chat,
      mensajes
    });

  } catch (error) {
    console.error("ERROR en getChatCon:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};



postChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { user2Id } = req.query;

    if (!user2Id) {
      return res.status(400).json({ msg: "Falta user2Id en la query" });
    }

    // 🔑 ORDENAR SIEMPRE PRIMERO
    const u1 = Math.min(userId, Number(user2Id));
    const u2 = Math.max(userId, Number(user2Id));

    // 🔍 Buscar chat existente
    let chat = await Chat.findOne({
      where: {
        user1Id: u1,
        user2Id: u2
      }
    });

    // ➕ Crear si no existe
    if (!chat) {
      chat = await Chat.create({
        user1Id: u1,
        user2Id: u2
      });

      console.log("Chat creado:", chat.id);
    }

    return res.status(200).json({
      msg: "Chat listo",
      chat
    });

  } catch (error) {
    console.error("ERROR en postChat:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};



const getAllChats = async (req, res) => {
  try {
    const userLog = req.user.id;

    // Buscar todos los chats donde participa
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1Id: userLog },
          { user2Id: userLog }
        ]
      },
      include: [
        {
          model: Mensaje,
          limit: 1,
          order: [['createdAt', 'DESC']], // último mensaje
        },
        {
  model: User,
  as: 'usuario1',
  attributes: ['id', 'userName', 'avatar']
},
{
  model: User,
  as: 'usuario2',
  attributes: ['id', 'userName', 'avatar']
}
      ]
    });

    // Transformar para obtener el "otro usuario" + último mensaje
    const resultado = chats
      .map(chat => {
        const ultimoMensaje = chat.Mensajes[0];

        return {
          chat: chat,
          otroUsuario:chat.user1Id === userLog ? chat.usuario2 : chat.usuario1,
          ultimoMensaje: ultimoMensaje ? ultimoMensaje.contenido : null,
          fecha: ultimoMensaje ? ultimoMensaje.createdAt : null
        };
      })
      .sort((a, b) => {
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return new Date(b.fecha) - new Date(a.fecha);
      });

    res.json({ ok: true, chats: resultado });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};


patchClavaVisto=async(req,res)=>{
  try {
    console.log("PATCH CLAVA VISTO EN CHAT")
    const {ChatId,userId}=req.params; // userId es el id del usuario que clava el visto
   console.log("chatId  --> ",ChatId)
    const chat = await Chat.findByPk(ChatId);
    if(!chat){
      return res.status(400).json({ msg: "El chatId no corresponde a un chat existente" });
    }

    const userNum = (userId) == chat.user1Id ? 1 : 2;


    if(userNum==1){
      await chat.update({user1ClavaVisto:true});
    }else if(userNum==2){
      await chat.update({user2ClavaVisto:true});
    }else{
      return res.status(400).json({ msg: "userNum debe ser 1 o 2" });
    }
    res.status(201).json({msg:"PATCH. Clava visto actualizado correctamente\n",chat,userNum})
        
  } catch (error) {     
      console.log("ERROR en patchClavaVisto: ",error)
      res.status(400).json({error})
  }
}


module.exports={
    //userGet,userPatch,userDelete,userPut,
    getAllChats,
    getChatsByMsgContacto,
    getChatCon, // retorna a un chat entre dos usuarios, el logueado y otro, con sus mensajes
    patchClavaVisto,
    postChat,
  }
