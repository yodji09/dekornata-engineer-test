'use strict';
module.exports = (sequelize, DataTypes) => {
  class Transaction extends sequelize.Sequelize.Model{};
  Transaction.init({
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : true
      },
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    ProductId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : true
      },
      references: {
        model: 'Products',
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
        transaction.price = 1
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