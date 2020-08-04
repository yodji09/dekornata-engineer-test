'use strict';
module.exports = (sequelize, DataTypes) => {
  class Role extends sequelize.Sequelize.Models{};
  Role.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          args: true,
          message: 'Name cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Name cannot be null'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Role'
  });
  Role.associate = function(models) {
    Role.hasMany(models.User);
  };
  return Role;
};