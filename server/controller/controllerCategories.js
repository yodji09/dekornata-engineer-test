"use strict";
const {Category, Product} = require('../models');

class ControllerCategories {
  static findAll = async(req, res, next) => {
    try {
      const categories = await Category.findAll({
          include : Product
      });
      if(categories) {
        res.status(200).json({
          Categories : categories
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static findOne = async (req, res, next) => {
    try {
      const categories = await Category.findByPk(req.params.id, {
        include : Product
      });
      if (categories) {
        res.status(200).json({
          Categories : categories
        });
      };
    } catch (error) {
      return next(error);
    }
  }

  static create = async(req, res, next) => {
    try {
      const {name} = req.body;
      const value = {name};
      const categories = await Category.create(value, {
        include: Product
      });
      if(categories) {
        res.status(201).json({
            Categories : categories
        });
      };
    } catch (error) {
      return next(error);
    }
  }

  static editData = async(req, res, next) => {
    try {
      const {id} = req.params;
      const {name} = req.body;
      const value = {name};
      let categories = await Category.update(value, {
        where : {
          id
        }
      });
      if (categories) {
        categories = await Category.findByPk(id, {
          include: Product
        });
        if(categories) {
          res.status(202).json({
              Categories : categories
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
      const result = await Category.destroy({where : {id}})
      if(result) {
        res.status(202).json({
          message : `Succes destroy category with id ${id}`
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ControllerCategories;