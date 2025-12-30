const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const{ User} = require('../models');


const validarJWT = async( req = request, res = response, next ) => {
    console.log("VALIDAR JWT")
    
    
    try {
        
        let token = req.header('Authorization');
         if (!token) {
           return res.status(401).json({
             msg: 'No hay token en la petición'
           });
         }

         if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
         }
        const { userId } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
       const usuario = await User.findByPk(userId);
       // usuario=await Usuario.findById(uid);
        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
        
        req.user = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}