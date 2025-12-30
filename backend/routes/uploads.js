const {Router}=require('express');
const { check } = require('express-validator');
//const { validarCampos, validarArchivoSubir } = require('../middleware');
//const{coleccionesPermitidas}=require('../helpers')
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
//const { actualizarImagenCloudinary,mostrarImagen } = require('../controllers/uploads');


const router=Router();

router.post('/',cargarArchivo);
router.put('/:coleccion/:id',actualizarImagen);
router.get('/:coleccion/:id',mostrarImagen)
module.exports=router;