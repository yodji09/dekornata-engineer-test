"use strict";
const {Transaction, Product, User} = require('../models');

class ControllerTransactions {
  static CreateTransaction = async(req, res, next) => {
    try {
      const UserId = req.currentUser;
      const { ProductId } = req.body;
      const value = {
        UserId,
        ProductId: parseInt(ProductId)
      };
      const transactions = await Transaction.findOne({
        where : {
          ProductId,
          status:false}
      });
      if(transactions) {
        return next({
          code: 400,
          type: 'Bad Request',
          msg: 'Wishlist already exist'
        });
      } else {
        const newTransaction = await Transaction.create(value);
        if(newTransaction) {
          const wishlists = await Transaction.findByPk(newTransaction.id,
            {include: Product}
          );
          if(wishlists) {
            res.status(201).json({
              Wishlists: wishlists
            });
          };
        };
      };
    } catch (error) {
      console.log(error)
      return next(error);
    };
  }

  static findAll = async(req, res, next) => {
    try {
      const UserId = req.currentUser;
      const wishlists = await Transaction.findAll({where: {
        UserId,
        status:false},
        include: Product
      });
      if(wishlists) {
        res.status(200).json({
          Wishlists: wishlists
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static checkOut(req, res, next) {
    const {listCheckOut} = req.body;
    const UserId = req.currentUser;
    const promise = [];
    const promises = listCheckOut.forEach(element => {
      const value = {
        quantity: element.quantity,
        status: true,
        price: element.Product.price * element.quantity
      };
      promise.push(Transaction.update(value, {where: {id: element.id}}));
      promise.push(Product.decrement('stock', {by: element.quantity, where: {id: element.Product.id}}));
    });
    Promise
      .all(promise)
      .then(data => {
        return User.findByPk(req.currentUser)
      })
      .then(data => {
        res.status(200).json({
          money: data.money,
          message: 'your transaction will processed'
        });
      })
      .catch(error => {
        return next(error);
      })
  }

  static checkOutHistory = async(req, res, next) => {
    try {
      const UserId = req.currentUser;
      const transactions = await Transaction.findAll({
        where: {UserId, status:true},
        include: Product,
        order: [['updatedAt', 'ASC']]
      });
      if (transactions) {
        res.status(200).json({
          Transactions: transactions
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static deleteWishlist = async(req, res, next) => {
    try {
      const UserId = req.currentUser;
      const id = req.params.id;
      const results = await Transaction.destroy({where: {id}});
      if(results) {
        res.status(200).json({
          message: 'Succes delete wishlists'
        });
      };
    } catch (error) {
      return next(error);
    };
  }
}

module.exports = ControllerTransactions;