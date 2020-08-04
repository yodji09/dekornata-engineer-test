'use strict';
module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Models{};
  Category.init({
    name: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        message: 'Category name must be unique'
      },
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
    },
  }, {
    sequelize,
    modelName: 'Category'
  });
  Category.associate = function(models) {
    Category.hasMany(models.Product);
  };
  return Category;
};