var express = require('express');
const { postContacto, getContactos, getContactosPorUserNameAndEmail, getMisContactos } = require('../controllers/contacto');
const { validarJWT } = require('../middlewares/validar-jwt');
var router = express.Router();



router.get('/all',[ validarJWT], 
    getContactos);
router.get('/porUserNameAndEmail',[ 
                  validarJWT], 
           getContactosPorUserNameAndEmail);
router.get('/misContactos',[ 
               validarJWT],
           getMisContactos);
router.post('/',[ 
               validarJWT], 
            postContacto);

module.exports = router;