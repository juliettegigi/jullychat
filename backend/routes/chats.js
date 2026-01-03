var express = require('express');
const { getChatsByMsgContacto,getChatCon,postChat,getAllChats,patchIsRead} = require('../controllers/chat');
const { validarJWT } = require('../middlewares/validar-jwt');
var router = express.Router();



router.get('/byMsgContacto',[ validarJWT], 
    getChatsByMsgContacto);
router.get('/MsgCon',[ validarJWT], 
    getChatCon);
router.get('/chats',[ validarJWT], 
    getAllChats);
router.post('/',[ validarJWT], 
    postChat);


module.exports = router;