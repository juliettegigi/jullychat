var express = require('express');
const { login, loginGoogle } = require('../controllers/sesion');
var router = express.Router();


router.post('/login', login );
router.post('/loginGoogle', loginGoogle );

module.exports = router;
