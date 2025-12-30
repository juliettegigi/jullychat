
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Contactos: relación muchos a muchos consigo mismo
      User.belongsToMany(models.User, { through: models.Contacto, as: 'misContactos',foreignKey: 'userId', otherKey: 'contactoId'});

      User.belongsToMany(models.User, {through: models.Contacto,as: 'contactoDe', foreignKey: 'contactoId',otherKey: 'userId'});

      // Chats
      User.hasMany(models.Chat, {
        foreignKey: 'user1Id',
        as: 'chateoCon'
      });

      User.hasMany(models.Chat, {
        foreignKey: 'user2Id',
        as: 'chateanConmigo'
      });

      // Mensajes
      User.hasMany(models.Mensaje, {
        foreignKey: 'emisorId',
        as: 'mensajesEnviados'
      });
    }
  }

  User.init({
    userName: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: {
  type: DataTypes.STRING
}
  }, {
    sequelize
  });

  return User;
};