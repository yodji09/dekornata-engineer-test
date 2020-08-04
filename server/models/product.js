'use strict';
module.exports = (sequelize, DataTypes) => {
  class Product extends sequelize.Sequelize.Models{};
  Product.init({
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
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          args: true,
          message: 'Image url cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Image url cannot be null'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          message: 'Price cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Price cannot be null'
        },
        min: {
          args: 0,
          message: 'Price must greater than 0'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          message: 'Stock cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Stock cannot be null'
        },
        min: {
          args: 0,
          message: 'Stock must greater than 0'
        }
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          message: 'Category id cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Category id cannot be null'
        }
      },
      refferences: {
        models: 'Categories',
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