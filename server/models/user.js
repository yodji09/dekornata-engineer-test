'use strict';
const {generatePassword} = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model{};
  User.init({
    name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          message: 'Name cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Name cannot be null'
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      unique : {
        args: true,
        message: 'Email already used'
      },
      validate : {
        notEmpty : {
          args: true,
          message: 'Email cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Email cannot be null'
        },
        isEmail : {
          args: true,
          message: 'Please enter a valid email'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args: true,
          message: 'Password cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Password cannot be null'
        },
        len : {
          args: [8, 30],
          message: 'Password must be min 8 at length and max 30'
        }
      }
    },
    roleId: {
      type : DataTypes.INTEGER,
      references : {
        model : "Roles",
        key : "id"
      },
      onDelete : "cascade",
      onUpdate : "cascade"
    },
    money: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    hooks : {
      beforeCreate : (user) => {
        user.password = generatePassword(user.password);
        user.RoleId = 1;
        user.money = 0
      }
    },
    modelName : "User"
  });
  User.associate = function(models) {
    User.belongsTo(models.Role);
    User.belongsToMany(models.Product, {through: 'Transactions'});
  };
  return User;
};