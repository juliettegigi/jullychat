const path=require('path')
const fs=require('fs')
const { Router,response } = require('express');
const router=Router();
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo } = require('../helpers');
const {User} = require('../models');


/* const cargarArchivo = async (req, res = response) => {
    try {
        const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre: pathCompleto
        });
        return pathCompleto
    }
    catch (err) {
        res.status(400).json({
            err
        })
    };

} */



const actualizarImagen = async (req, res = response) => {
     if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
     return res.status(400).json('No files were uploaded.');
     }

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
        
            break;
        default: res.status(500).json({ // por si alguien quiere usar una cosa q no es usuario
            msg: 'Se me olvidó validar esto'
        })
    }

    // antes de subir una imagen tengo que borrar de cloudinary
    if(modelo.avatar){
        //secure_url tien al final unas letras únicas
        const nombreArr=modelo.avatar.split('/');
        const nombre=nombreArr[nombreArr.length-1]; 
        
      
    }

    //subir el archivo a cloudinary
    //await cloudinary.uploader.upload(tempFilePath) eso retorna un objeto con info de la img, un montón de cosas incluso la secure_url, la url de la img
    const{tempFilePath}=req.files.archivo;
    const {secure_url}=await cloudinary.uploader.upload(tempFilePath);// le paso el path de la imagen, q está en un path temporal
    //podría mandar req.files.data o el req.files.archivo.tempFilePath
    modelo.avatar=secure_url;
     
    await modelo.save();
   // await Usuario.findByIdAndUpdate(id,modelo);
    res.json(modelo);
}



module.exports = {
    //cargarArchivo,
    actualizarImagen
}