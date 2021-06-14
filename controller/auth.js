const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// user sign up
exports.signUp = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { firstName, lastName, email, password, confirmPassword } = req.body;

  await User.findOne({ email })
    .then(async (user) => {
      if (user) {
        res.status(400).json({error: `User already exist!`});
        return;
      }

      // hash password
      const salt = await bcrypt.genSaltSync(10);
      let hashedPassword = await bcrypt.hashSync(password, salt);

      // create new user
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        userName:
          firstName.slice(0, 4) + Math.floor(Math.random() * 1000).toString(),
        email: email,
        password: hashedPassword,
      });
      newUser.save().then((user) => {
        if (user) {
          const {
            id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            userName,
          } = user
          jwt.sign(
            { id: user.id },
            process.env.jwtSecret,
            { expiresIn: "30days" },
            (err, token) => {
              console.log(token);
              res.status(200).json({
                token,
                user: {
                  id,
                  firstName,
                  lastName,
                  email,
                  role,
                  fullName,
                  userName,
                },
                msg: "User Created Successfully",
              });
            }
          );
        }
      });
      // .catch (err => {
      //     res.status(200).send(JSON.stringify(`Registration was not successfull`))
      //     return
      // })
    })
    .catch((err) => {
      res
        .status(400)
        .json({error: `Registration was not successfull ${err}`});
      return;
    });
};

// User sign in
exports.signIn = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({error: `Please input all fields`});
    return;
  }

  try {
    User.findOne({ email }).exec((err, user) => {
      if (!user) {
        res
          .status(404)
          .json({ error: "User does not exits!"});
        return;
      }
      if (err) {
        return res.status(400).json({error: `Unable to login ${err}`});
      }
      //console.log(user)
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          res.status(400).json({error: `Invalid password`});
          return;
        }
        const {
          id,
          firstName,
          lastName,
          email,
          role,
          fullName,
          userName,
        } = user;
        if (user && user.role === "user") {
          jwt.sign(
            { id: id, role },
            process.env.jwtSecret,
            { expiresIn: "30days" },
            (err, token) => {
              res.status(200).json({
                token,
                user: {
                  id,
                  firstName,
                  lastName,
                  email,
                  role,
                  fullName,
                  userName,
                },
              });
            }
          );
        } else {
          res
            .status(401)
            .json({error: `You are not allowed to access this page`});
          return;
        }
      });
    });
  } catch (err) {
    res.status(400).json({error: `Unable to login ${err}`});
    return;
  }
};
