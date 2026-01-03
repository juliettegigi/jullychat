'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mensaje extends Model {
    static associate(models) {
      Mensaje.belongsTo(models.User, {foreignKey:'emisorId', as:'emisor'}) //el usuario que envía el mensaje
      Mensaje.belongsTo(models.Chat)
    }
  }
  Mensaje.init({
    contenido: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Mensaje',
  });
  return Mensaje;
};