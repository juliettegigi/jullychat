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



/* const patchIsRead=async(req, res)=>{
        try {
    const { chatId } = req.query;

    const chat = await Mensaje.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({
        msg: 'Chat no encontrado'
      });
    }

    await chat.update({ isRead: true });

    return res.status(200).json({
      msg: 'Chat marcado como leído'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Error interno del servidor'
    });
  }
}; */

module.exports={
    //userGet,userPatch,userDelete,userPut,
    getMensajes,
   // patchIsRead
}
