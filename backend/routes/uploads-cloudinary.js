const {Router}=require('express');
const { check } = require('express-validator');
//const { validarCampos, validarArchivoSubir } = require('../middleware');
//const{coleccionesPermitidas}=require('../helpers')
const {  actualizarImagen } = require('../controllers/uploads-cloudinary');
//const { actualizarImagenCloudinary,mostrarImagen } = require('../controllers/uploads');


const router=Router();


router.put('/:coleccion/:id',actualizarImagen);
module.exports=router;