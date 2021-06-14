const express = require("express");
const router = express.Router();
const {requireSignIn, userMiddleware} = require("../middleware")
const {addAddress, getAddress} = require('../controller/address');

router.post('/user/address/create', requireSignIn, userMiddleware, addAddress)
router.get('/user/getAddress', requireSignIn, userMiddleware, getAddress);

module.exports = router;
