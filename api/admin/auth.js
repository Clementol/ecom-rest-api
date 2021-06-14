const express = require("express");
const router = express.Router();
const {
  validateSignupRequest,
  validateSigninRequest,
  isRequestValidated,
} = require("../../validators/auth");
const User = require("../../models/user");
const { requireSignIn } = require("../../middleware");
const { signUp, signIn, signOut } = require("../../controller/admin/auth");
const { auth } = require("../../middleware");

// sign up
router.post(
  "/admin/sign-up",
  validateSignupRequest,
  isRequestValidated,
  signUp
);

// sign in
router.post(
  "/admin/sign-in",
  validateSigninRequest,
  isRequestValidated,
  signIn
);

// sign out
router.post("/admin/sign-out", signOut);

module.exports = router;
