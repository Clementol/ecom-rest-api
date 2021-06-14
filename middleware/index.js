const jwt = require('jsonwebtoken');
const path = require('path')
const multer = require('multer');

const jwtSecret = process.env.jwtSecret

const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, shortid.generate() + "-" + Date.now() + "-" + file.originalname);
  }
});

exports.upload = multer({ storage: storage });

exports.requireSignIn = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if (!token) {
        res.status(401).send(JSON.stringify({msg: 'Authorization is required'}))
        return
    }


    try {
        //Verify token
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded) {
            req.user = decoded;
            console.log(req.user)
            next()
        }
    } catch (error) {
        res.status(401).send(JSON.stringify({msg: `Token is not valid ${error}`}))

    }
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).send(JSON.stringify(`User Access denied!`))
    }
    next();
}

exports.adminMiddleware = (req, res, next) => {
    // console.log(req.user)
    if (req.user.role !== 'admin') {
        return res.status(400).send(JSON.stringify(`Admin Access denied!`))
    }
    next();
}
