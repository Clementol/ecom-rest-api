const express = require("express");
const router = express.Router();
const {
  validateSignupRequest,
  validateSigninRequest,
  isRequestValidated,
} = require("../validators/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signUp, signIn } = require("../controller/auth");
const { requireSignIn } = require("../middleware");

// sign up
router.post("/sign-up", validateSignupRequest, isRequestValidated, signUp);

// sign in
router.post("/sign-in", validateSigninRequest, isRequestValidated, signIn);

router.post("/profile", requireSignIn, (req, res) => {
  res.status(200).send(JSON.stringify({ user: "profile" }));
});

module.exports = router;
