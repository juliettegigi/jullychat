var express = require('express');
const { userPost, getUsersPorUserNameAndEmail ,getUserById} = require('../controllers/user');
const { validarJWT } = require('../middlewares/validar-jwt');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', userPost);

// busaca los usuarios por name e email pero no incluye a los que ya son contactos
router.get('/buscar/:termino',[ validarJWT],getUsersPorUserNameAndEmail)
router.get('/:id',[ validarJWT],getUserById)


module.exports = router;
