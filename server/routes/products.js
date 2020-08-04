"use strict";
const router = require('express').Router();
const Authentication = require('../middlewares/authentication');
const Authorization = require('../middlewares/authorization');
const ControllerProducts = require('../controller/controllerProducts');

router.get('/', ControllerProducts.findAll);
router.use(Authentication);
router.post('/', Authorization, ControllerProducts.create);
router.get('/:id', ControllerProducts.findOne);
router.put('/:id', Authorization, ControllerProducts.editData);
router.delete('/:id', Authorization, ControllerProducts.deleteData);

module.exports = router;