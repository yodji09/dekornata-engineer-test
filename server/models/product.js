'use strict';
module.exports = (sequelize, DataTypes) => {
  class Product extends sequelize.Sequelize.Model{};
  Product.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : true
      }
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : true,
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : true,
        min: 0
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : true,
      },
      references: {
        model: 'Categories',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    sequelize,
    modelName: 'Product'
  });
  Product.associate = function(models) {
    Product.belongsTo(models.Category);
    Product.belongsToMany(models.User, {through: 'Transactions'});
  };
  return Product;
};