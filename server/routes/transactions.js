"use strict";
const router = require('express').Router();
const ControllerTransactions = require("../controller/controllerTransactions");
const Authentication = require('../middlewares/authentication');
const authorizationUser = require('../middlewares/authorizationUser');
const ControllerUsers = require('../controller/controllerUsers');

router.use(Authentication);
router.get('/', ControllerTransactions.findAll);
router.post('/', ControllerTransactions.CreateTransaction);
router.put('/checkout', authorizationUser, ControllerUsers.transaction, ControllerTransactions.checkOut)
router.get('/history', ControllerTransactions.checkOutHistory)
router.delete('/:id', ControllerTransactions.deleteWishlist)

module.exports = router;