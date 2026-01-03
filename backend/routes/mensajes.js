var express = require('express');
const { getMensajes } = require('../controllers/mensaje');
const { validarJWT } = require('../middlewares/validar-jwt');
var router = express.Router();




router.get('/all',[ validarJWT], 
    getMensajes);
//router.patch('/isRead',[validarJWT], patchIsRead)

module.exports = router;