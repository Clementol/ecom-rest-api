const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

// user sign up
exports.signUp = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { firstName, lastName, email, password, confirmPassword } = req.body;

  await User.findOne({ email })
    .then(async user => {
      if (user) {
        res.status(400).send(JSON.stringify(`Admin already exist!`));
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
        role: "admin"
      });
      newUser.save().then(user => {
        if (user) {
          jwt.sign(
            { id: user.id },
            process.env.jwtSecret,
            { expiresIn: "30days" },
            (err, token) => {
              console.log(token);
              res.status(200).json({
                message: "Admin Created Successfully"
              });
            }
          );
        }
      });
      // .catch (err => {
      // res.status(200).send(JSON.stringify(`Registration was not successfull`))
      //     return
      // })
    })
    .catch(err => {
      res
        .status(400)
        .send(JSON.stringify(`Registration was not successfull ${err}`));
      return;
    });
};

// User sign in
exports.signIn = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // res.setHeader("Set-Cookie", "visited=true; max-Age=900000; ");
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send(JSON.stringify(`Please input all fie lds`));
    return;
  }

  try {
    User.findOne({ email }).then(user => {
      if (!user) {
        res
          .status(401)
          .send(JSON.stringify({ msg: "Admin does not exits!", id: "" }));
        return;
      }
      //console.log(user)
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          res.status(400).send(JSON.stringify(`Invalid password`));
          return;
        }
        if (user && user.role === "admin") {
          const {
            id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            userName
          } = user;
          jwt.sign(
            { id: id, role },
            process.env.jwtSecret,
            { expiresIn: "30days" },
            (err, token) => {
              res.cookie("token", token, { maxAge: 900000, httpOnly: true });
              // console.log("cookeies", res.headers["Set-Cookie"]);

              res.status(200).json({
                token,
                user: {
                  id,
                  firstName,
                  lastName,
                  email,
                  role,
                  fullName,
                  userName
                }
              });
            }
          );
        } else {
          res
            .status(401)
            .send(JSON.stringify(`You are not allowed to access this page`));
          return;
        }
      });
    });
  } catch (err) {
    res.status(400).send(JSON.stringify(`Unable to login ${err}`));
    return;
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Sign Out Successfully" });
};
