const {User,sequelize} = require('../models');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


const login=async(req,res)=>{
    try {
        console.log("lBODY LOGIN \n",req.body)
        const {email:emailBody,pass}=req.body; 
        const user=await User.findOne({where:{email:emailBody}})
        if(!user)
            return res.status(400).json(null)
        
        // existe usuario con tal email
        const validPassword=bcryptjs.compareSync(pass,user.pass)
        if(!validPassword){ // la password proporcionada no es correcta
                return res.status(400).json(null) 
        }
        //email y password correctos
        const token=await generarJWT(user.id)   
        res.json({
            user:{
                id:user.id,
                useName:user.name,
                email:user.email,
                
            },
            token
        })
            
             
        
    } catch (error) {
        console.log(error)
        res.status(500).json(null) 
    }
   
}


module.exports = {
    login   
}