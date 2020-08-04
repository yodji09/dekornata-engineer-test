"use strict";
const router = require("express").Router();
const ControllerCategories = require('../controller/controllerCategories');
const Authentication = require('../middlewares/authentication');
const Authorization = require('../middlewares/authorization');

router.get('/', ControllerCategories.findAll);
router.use(Authentication);
router.get('/:id', ControllerCategories.findOne);
router.post('/', Authorization, ControllerCategories.create);
router.put('/:id', Authorization, ControllerCategories.editData);
router.delete('/:id', Authorization, ControllerCategories.deleteData);

module.exports = router;