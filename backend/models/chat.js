'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User,{foreignKey:'user1Id', as:'usuario1'}), 
      Chat.belongsTo(models.User,{foreignKey:'user2Id', as:'usuario2'}), 
      Chat.hasMany(models.Mensaje) 
    }
  }
  Chat.init({
    user1ClavaVisto: DataTypes.BOOLEAN,
    user2ClavaVisto: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Chat',
    tableName:'chats'
  });
  return Chat;
};