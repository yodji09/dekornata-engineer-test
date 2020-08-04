"use strict";
const {User, Role} = require("../models");
const {comparePassword} = require("../helpers/bcrypt");
const {generateToken} = require("../helpers/jwt");

class ControllerUsers {
  static login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
      const user = await User.findOne({where: {email}, include: Role})
      if(user) {
        if(comparePassword(password, user.password)){
          let token = generateToken({
            id : user.id,
            email : user.email
          });
          res.status(202).json({
            acces_token : token,
            Role : user.Role,
            money: user.money,
            name: user.name
          });
        } else {
          return next({
            type : "Bad Request",
            code : 400,
            msg : "Wrong Password"
          });
        };
      } else {
        return next({
          type : "Bad Request",
          code : 400,
          msg : "User Doesn't exist"
        });
      };
    } catch (error) {
      return next(error);
    };
  }

  static register = async(req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    const value = {
      name,
      email,
      password
    };
    if(password !== confirmPassword){
      return next({
        type : "Bad Request",
        code : 400,
        msg : "Password and Confirm Password doesn't match"
      });
    };
    try {
      const user = await User.create(value)
      res.status(201).json({
        id : user.id,
        email : user.email
      });
    } catch (error) {
      return next(error);
    };
  }

  static topup = async(req, res, next) => {
    try {
      const {money} = req.body;
      const user = await User.increment(
        ['money'],
        {
          by: money,
          where:
            {
              id: req.currentUser
            }
      });
      if(user) {
        const Money = await User.findByPk(req.currentUser);
        if(Money) {
          res.status(200).json({
            money: Money.money,
            message: "Your balanced has been increased"
          });
        };
      };
    } catch (error) {
      return next(error);
    };
  }
  static transaction = async (req, res, next) => {
    try {
      const {totalPrice: money} = req.body;
      const userMoney = await User.findByPk(req.currentUser)
      if(userMoney.money >= money) {
        const user = await User.decrement(
          ['money'],
          {
            by: money,
            where: {
              id: req.currentUser
            }
          }
        );
        if(user) {
          next();
        };
      } else {
        return next({
          type: 'Bad Request',
          code: 400,
          msg: 'You dont have enough money, Please Top Up first'
        })
      }
    } catch (error) {
      return next(error);
    };
  }
}

module.exports = ControllerUsers;