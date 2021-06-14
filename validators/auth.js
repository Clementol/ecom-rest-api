const { body, check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").notEmpty().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 7 })
    .withMessage("Password must be atleast 7 characters long"),

  // check("confirmPassword")
  //   .notEmpty()
  //   .withMessage("Password must be atleast 7 characters long")
  //   .custom((confirmPassword, { req }) => {
  //     const { password } = req.body;
  //     if (password !== confirmPassword) {
  //       throw new Error(`Passwords must correspond`);
  //     }
  //     return true;
  //   }),
];
exports.validateSigninRequest = [
  check("email").notEmpty().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 7 })
    .withMessage("Password must be atleast 7 characters long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    console.log(errors.array()[0]);
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }
  next();
};
;