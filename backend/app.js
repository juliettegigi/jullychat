var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

var sesionRouter = require('./routes/sesion');
var usersRouter = require('./routes/users');
var mensajesRouter = require('./routes/mensajes');
var contactosRouter = require('./routes/contactos');
var chatsRouter = require('./routes/chats');
var uploadsRouter = require('./routes/uploads');
var uploadsCloudinaryRouter = require('./routes/uploads-cloudinary');
const angularPath = path.join(
  __dirname,
  '../my-app/dist/my-app/browser'
);
var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(angularPath));
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use('/api/sesion', sesionRouter);
app.use('/api/users', usersRouter);
app.use('/api/mensajes', mensajesRouter);
app.use('/api/contactos', contactosRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/uploadsCloudinary', uploadsCloudinaryRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});


module.exports = app;
