const { Op, fn, col,literal ,Sequelize} = require('sequelize');
const { Contacto,Mensaje ,User,sequelize} = require('../models');


const getContactos=async(req,res)=>{
 
    try {
        console.log("GET CONTACTOS")
          
const contactos = await Contacto.findAll({  // contacto tiene userId y contactoId
  where: { userId: req.user.id },
  include: [
    {
      model: User, //el user  no tiene id de otras tablas, pero otras tablas tienen userId
      as: "misContactos", // para que me traiga User del contactoId 
      include:[
        {
          model:Mensaje,
          as:"mensajesEnviados",
          where:{
            emisorId: req.user.id     
        }}        
        
      ]
     
    }
  
  ]
});

console.log("---------------------- CONTACTOS ----------------------")
console.log(contactos)
for(let contacto of contactos){
  console.log(contacto.usuario)
}
console.log("-------------------------------------------------------")

        res.status(201).json({msg:"GET. Contactos obtenidos correctamente\n",contactos})
            
    } catch (error) {
        console.log("ERROR en getContactos: ",error)
        res.status(400).json({error})
    }
}



const getContactosPorUserNameAndEmail=async(req,res)=>{
 
    try {

        const{limit,offset}=req.query;
        const{termino}=req.body; // puede ser userName o email
        console.log("GET CONTACTOS")


        const exactMatchFirst = Sequelize.literal(`
              CASE
                WHEN LOWER(\`Usuario\`.\`userName\`) = LOWER(${sequelize.escape(termino)}) THEN 0
                WHEN LOWER(\`Usuario\`.\`email\`) = LOWER(${sequelize.escape(termino)}) THEN 0
                ELSE 1
              END
            `);
                
      const orderByDistance = Sequelize.literal(`
              LEAST(
                levenshtein(LOWER(\`Usuario\`.\`userName\`), LOWER(${sequelize.escape(termino)})),
                levenshtein(LOWER(\`Usuario\`.\`email\`), LOWER(${sequelize.escape(termino)}))
              )
            `);

       const safeTerm = sequelize.escape(termino).slice(1, -1); // quita las comillas de 'termino', ecape le pone comillas
       
       const orderByLikeMatch = Sequelize.literal(`
         CASE
           WHEN \`Usuario\`.\`userName\` LIKE '%${safeTerm}%' THEN 0
           WHEN \`Usuario\`.\`email\` LIKE '%${safeTerm}%' THEN 0
           ELSE 1
         END
       `);
          
        const contactos = await Contacto.findAll({  // contacto tiene userId y contactoId
          where: {[Op.and]: [
                           {userId: req.user.id} ,
                           {termino: { [Op.or]: [ {userName: { [Op.like]: `%${termino}%` }}, 
                                                  {email: { [Op.like]: `%${termino}%` }},
                                                  Sequelize.where( Sequelize.fn('levenshtein', Sequelize.col('userName'), termino),
                                                   { [Op.lte]: 6 },
                                                   Sequelize.where(  Sequelize.fn('levenshtein', Sequelize.col('email'), termino),
                                                   { [Op.lte]: 6 }
                                                 ),
                                                 ), 
                                     ] }
                           }
                  ]},
          include: [
            {
              model: User, //el user  no tiene id de otras tablas, pero otras tablas tienen userId
              as: "misContactos", // para que me traiga User del contactoId 
             
            }
          
          ],
          order: [
            [exactMatchFirst, 'ASC'],
            [orderByLikeMatch, 'ASC'],
            [orderByDistance, 'ASC'],
            ['userName', 'ASC'],
            ['email', 'ASC'],
          ],
          limit:limit ? parseInt(limit) : undefined,   // Sequelize los ignora si están en undefined
          offset:offset ? parseInt(offset) : undefined,
        });

console.log("---------------------- CONTACTOS ----------------------")
console.log(contactos)
console.log("-------------------------------------------------------")

        res.status(201).json({msg:"GET. Contactos obtenidos correctamente\n",contactos})
            
    } catch (error) {
        console.log("ERROR en getContactos: ",error)
        res.status(400).json({error})
    }
}

const postContacto=async(req,res)=>{
 
    try {
        console.log("POST CONTACTO")
        await Contacto.create({userId:req.user.id,contactoId:req.body.contactoId})

        res.status(201).json({msg:"Post. Contacto agregado. "})
            
    } catch (error) {
        console.log("ERROR en postContacto: ",error)
        res.status(400).json({error})
    }
}

// retorno un arreglo de usuarios
const getMisContactos=async(req,res)=>{
    try {
        console.log("GET MIS CONTACTOS")
           const contactos = await Contacto.findAll({ where: { userId: req.user.id },
                                                      include: [
                                                        {
                                                          model: User,
                                                          as: 'misContactos' ,
                                                          attributes: { exclude: ['pass'] }
                                                        }
                                                      ]
    });

    console.log("---------------------- MIS CONTACTOS ----------------------")
    console.log(contactos)
    console.log("-------------------------------------------------------")
    console.log(contactos[0].misContactos);
        res.status(201).json(contactos.map(c=>c.misContactos))  }
    catch (error) {
        console.log("ERROR en getMisContactos: ",error)
        res.status(400).json({error})
    }
}

module.exports={
    //userGet,userPatch,userDelete,userPut,
    getContactos,
    getContactosPorUserNameAndEmail,
    postContacto,
    getMisContactos
}
