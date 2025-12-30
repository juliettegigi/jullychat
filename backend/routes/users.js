var express = require('express');
const { userPost, getUsersPorUserNameAndEmail } = require('../controllers/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', userPost);
router.get('/:termino',getUsersPorUserNameAndEmail)

module.exports = router;
