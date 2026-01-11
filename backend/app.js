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


const db = require('./models');// 👈 NUEVO


const angularPath = path.join(
  __dirname,
  '../my-app/dist/my-app/browser'
);
var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Esto habilita popups de Google sin romper seguridad.
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});




/* 🚫 NO CORS en producción */
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:4200'
  }));
}
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir: path.join(__dirname, 'tmp')
}));


app.use('/api/sesion', sesionRouter);
app.use('/api/users', usersRouter);
app.use('/api/mensajes', mensajesRouter);
app.use('/api/contactos', contactosRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/uploadsCloudinary', uploadsCloudinaryRouter);


//sirviendo Angular estático


app.use(express.static(angularPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(angularPath, 'index.csr.html'));
});




db.sequelize.authenticate()// 👈 NUEVO
  .then(() => {
    console.log('✅ Conectado a la base de datos');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
  })
  .catch(err => {
    console.error('❌ Error DB:', err);
  });

module.exports = app;
