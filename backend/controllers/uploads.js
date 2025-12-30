const { response } = require('express');
const {User,sequelize} = require('../models');
const { subirArchivo } = require('../helpers');
const path = require('path')
const fs = require('fs');


const cargarArchivo = async (req, res = response) => {
    try {
        const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre: pathCompleto
        });
        return pathCompleto
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            err
        })
    };

}




const actualizarImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;
    
    switch (coleccion) {
        case 'user':
            modelo = await User.findByPk(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        default: res.status(500).json({ // por si alguien quiere usar una cosa q no es usuario
            msg: 'Se me olvidó validar esto'
        })
    }

    // antes de subir una imagen tengo que borrar
    if(modelo.avatar){
        const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.avatar);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }
     
    const nombre=await subirArchivo(req.files,undefined,coleccion);
    modelo.avatar=nombre;
    console.log("ruta de la img:  ",modelo.avatar)
    await modelo.save();
    res.json(modelo);
}


const mostrarImagen=async(req,res=response)=>{
    const { coleccion, id } = req.params;

    let modelo;
    switch (coleccion) {
        case 'user':
            modelo = await User.findByPk(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        default: res.status(500).json({ // por si alguien quiere usar una cosa q no es usuario
            msg: 'Se me olvidó validar esto'
        })
    }

     if ( modelo.avatar ) {
          const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.avatar);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }
     
    const pathImagen = path.join( __dirname, '../assets/no-image.jfif');
    res.sendFile( pathImagen );
}

module.exports = {
    cargarArchivo,actualizarImagen,mostrarImagen
}