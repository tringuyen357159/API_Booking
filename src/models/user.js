'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey:'keyMap', as:'positionData'})
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey:'keyMap', as:'genderData'})
      User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey:'keyMap', as:'roleData'})
      User.hasOne(models.Markdown, {foreignKey: 'doctorId'})
      User.hasOne(models.Doctor_Infor, {foreignKey: 'doctorId'})
      User.hasMany(models.Schedule, { foreignKey: 'id', as:'doctorData'})
      User.hasMany(models.Booking, { foreignKey: 'patientId', as:'patientData'})
      
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    positionId: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};