const {request,response}=require('express');
const { Op ,Sequelize} = require('sequelize');
const bcryptjs=require('bcryptjs');
const { User ,sequelize} = require('../models');


const userPost=async(req=request,res=response)=>{
 
    try {
        const {userName="",email="",pass=""}=req.body;
        const usuario=await User.create({userName,email,pass})
      
        //encriptar la pass
        const salt=bcryptjs.genSaltSync();
        usuario.pass=bcryptjs.hashSync(pass,salt);
        await usuario.save();
        
        res.status(201).json({msg:"POST. Usuario creado correctamente\n",usuario})
        
    } catch (error) {
        console.log("ERROR en userPost: ",error)
        res.status(400).json({error})
    }
}


const getUsersPorUserNameAndEmail=async(req,res)=>{
 
    try {

        const{limit,offset}=req.query;
        const{termino}=req.params; // puede ser userName o email
        console.log('termino: ',termino)
        console.log("GET Users")


        const exactMatchFirst = Sequelize.literal(`
              CASE
                WHEN LOWER(\`userName\`) = LOWER(${sequelize.escape(termino)}) THEN 0
                WHEN LOWER(\`email\`) = LOWER(${sequelize.escape(termino)}) THEN 0
                ELSE 1
              END
            `);
                
      const orderByDistance = Sequelize.literal(`
              LEAST(
                levenshtein(LOWER(\`userName\`), LOWER(${sequelize.escape(termino)})),
                levenshtein(LOWER(\`email\`), LOWER(${sequelize.escape(termino)}))
              )
            `);

       const safeTerm = sequelize.escape(termino).slice(1, -1); // quita las comillas de 'termino', ecape le pone comillas
       
       const orderByLikeMatch = Sequelize.literal(`
         CASE
           WHEN \`userName\` LIKE '%${safeTerm}%' THEN 0
           WHEN \`email\` LIKE '%${safeTerm}%' THEN 0
           ELSE 1
         END
       `);
          
       const usuarios = await User.findAll({
          where: {
            [Op.or]: [
              { userName: { [Op.like]: `%${termino}%` } },
              { email: { [Op.like]: `%${termino}%` } },
              Sequelize.where(
                Sequelize.fn('levenshtein', Sequelize.col('userName'), termino),
                { [Op.lte]: 6 }
              ),
              Sequelize.where(
                Sequelize.fn('levenshtein', Sequelize.col('email'), termino),
                { [Op.lte]: 6 }
              ),
            ]
          },
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

console.log("---------------------- usuarios ----------------------")
console.log(usuarios)
console.log("-------------------------------------------------------")

        res.status(201).json({msg:"GET. usuario obtenidos correctamente\n",usuarios})
            
    } catch (error) {
        console.log("ERROR en getUsuarios: ",error)
        res.status(400).json({error})
    }
}









module.exports={
    //userGet,userPatch,userDelete,userPut,
    userPost,
    getUsersPorUserNameAndEmail,
}
