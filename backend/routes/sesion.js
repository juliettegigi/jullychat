var express = require('express');
const { login } = require('../controllers/sesion');
var router = express.Router();


router.post('/login', login );

module.exports = router;
