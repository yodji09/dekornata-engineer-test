"use strict";
const router = require('express').Router();
const Authentication = require('../middlewares/authentication');
const ControllerUsers = require('../controller/controllerUsers');

router.post("/login", ControllerUsers.login);
router.post("/register", ControllerUsers.register);
router.use(Authentication)
router.put("/topup", ControllerUsers.topup);

module.exports = router;