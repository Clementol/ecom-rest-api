const express = require("express");
const router = express.Router();

const {initialData} = require('../../controller/admin/initialData');
const { requireSignIn, adminMiddleware } = require("../../middleware");
// const { requireSignIn } = require("../../middleware");
// const { signUp, signIn, signOut } = require("../../controller/admin/auth");
// const { auth } = require("../../middleware");

// sign up
router.get('/initialdata', requireSignIn, adminMiddleware,  initialData);

module.exports = router;
