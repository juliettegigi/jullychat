const {User} = require('../models');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.pass) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const validPassword = await bcryptjs.compare(pass, user.pass);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = await generarJWT(user.id);

    res.json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json(null);
  }
};


const loginGoogle = async (req, res) => {
  try {
    const { id_token } = req.body;
    const payload = await googleVerify(id_token);

    let user = await User.findOne({ where: { email: payload.email } });

    // Si no existe → crear
    if (!user) {
      user = await User.create({
        userName: payload.name,
        email: payload.email,
        avatar: payload.picture,
        googleId: payload.sub
      });
    }

    // Si existe pero no tiene google vinculado → vincular
    if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const token = await generarJWT(user.id);

    res.json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token de Google inválido' });
  }
};

module.exports = {
    login ,loginGoogle  
}


/*Usuario creado con email + contraseña

Usuario creado con Google

Sin el campo google, no sabés cómo se registró.*/