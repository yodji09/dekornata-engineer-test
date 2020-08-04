"use strict";
const router = require('express').Router();
const userRouter = require('./users.js');
const productRouter = require('./products.js');
const categoryRouter = require('./categories.js');
const transactionRouter = require('./transactions.js');

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/transactions', transactionRouter);

module.exports = router;