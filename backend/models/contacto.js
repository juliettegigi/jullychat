'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contacto extends Model {
    static associate(models) {

      Contacto.belongsTo(models.User, {foreignKey:'userId', as:'usuario'}) //el usuario que tiene contactos
      Contacto.belongsTo(models.User, {foreignKey:'contactoId', as:'misContactos'}) //el usuario que es contacto de otro usuario

    }
  }
  Contacto.init({
  }, {
    sequelize,
    modelName: 'Contacto',
    tableName: 'contactos'
  });
  return Contacto;
};