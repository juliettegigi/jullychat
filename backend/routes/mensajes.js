var express = require('express');
const { getMensajes } = require('../controllers/mensaje');
const { validarJWT } = require('../middlewares/validar-jwt');
var router = express.Router();




router.get('/all',[ validarJWT], 
    getMensajes);

module.exports = router;