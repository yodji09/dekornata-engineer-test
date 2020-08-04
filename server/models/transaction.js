'use strict';
module.exports = (sequelize, DataTypes) => {
  class Transaction extends sequelize.Sequelize.Models{};
  Transaction.init({
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          message: 'User id cannot be empty'
        },
        notNull: {
          args: true,
          message: 'User id cannot be null'
        }
      },
      refferences: {
        models: 'Users',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    productId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          message: 'Product id cannot be empty'
        },
        notNull: {
          args: true,
          message: 'Product id cannot be null'
        }
      },
      refferences: {
        models: 'Products',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    status: DataTypes.BOOLEAN,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      beforeCreate: (transaction) => {
        transaction.status = false
        transaction.quantity = 1
      },
    },
    modelName: 'Transaction'
  });
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User);
    Transaction.belongsTo(models.Product);
  };
  return Transaction;
};