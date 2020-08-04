"use strict";
const {Category, Product} = require("../models");

class ControllerProducts {
  static findAll = async (req, res, next) => {
    try {
      const products = await Product.findAll({
        include : Category
      });
      if (products) {
        res.status(200).json({
          Products : products
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static findOne = async(req, res, next) => {
    try {
      const products = await Product.findByPk(req.params.id, {
        include : Category
      });
      if(products) {
        res.status(200).json({
          Products : products
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static create = async(req, res, next) => {
    try {
      const {name, image_url, price, stock, CategoryId} = req.body;
      const value = {
        name,
        image_url,
        price: parseInt(price),
        stock: parseInt(stock),
        CategoryId
      };
      let products = await Product.create(value);
      if(products) {
        products = await Product.findByPk(products.id, {
          include: Category
        });
        if(products) {
          res.status(201).json({
            Products : products
          });
        };
      };
    } catch (error) {
      return next(error);
    };
  }

  static editData = async(req, res, next) => {
    try {
      const {id} = req.params;
      const {name, image_url, price, stock, CategoryId} = req.body;
      const value = {
        name,
        image_url,
        price,
        stock,
        CategoryId
      };
      let products = await Product.update(value, {
        where : {
          id
        },
        include: Category
      });
      if(products) {
        products = await Product.findByPk(id);
        if(products) {
          res.status(202).json({
            Products : products
          });
        };
      };
    } catch (error) {
      return next(error);
    }
  }

  static deleteData = async(req, res, next) => {
    try {
      const {id} = req.params;
      const products = await Product.destroy({where : {id}}) ;
      if(products) {
        res.status(202).json({
          message : "Succes destroy product with id " + id
        });
      };
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ControllerProducts;