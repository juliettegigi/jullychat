const { Mensaje } = require('../models');


const getMensajes=async(req,res)=>{
 
    try {
        console.log("GET MENSAJES")
        const {receptorId}=req.Body;  
        
        const mensajes = await Mensaje.findAll({
          where: {
            [Op.or]: [
              { [Op.and]: [ { emisorId: req.user.id },
                            { receptorId: receptorId } ] },
              { [Op.and]: [ { emisorId: receptorId },
                            { receptorId: req.user.id } ]}
            ]
          },
          order: [['createdAt', 'ASC']] 
        });

        res.status(201).json({msg:"GET. Mensajes obtenidos correctamente\n",mensajes})
            
    } catch (error) {
        console.log("ERROR en userPost: ",error)
        res.status(400).json({error})
    }
}



module.exports={
    //userGet,userPatch,userDelete,userPut,
    getMensajes
}
