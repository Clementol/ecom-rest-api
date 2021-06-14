const http = require("http");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

// api routes

// admin auth
const adminAuth = require("./api/admin/auth");

// user auth
const auth = require("./api/auth");

// categories
const category = require("./api/category");

// Product
// const product = require("./api/product");

// initialData
const initialData = require('./api/admin/initialData')
// cart
const cart = require("./api/cart");

// Page
const pageRoutes = require('./api/admin/page') 

// Pruducts Details
const productRoutes = require('./api/product')

//Address

const addressRoutes = require('./api/address')

//Orders 
const orderRoutes = require('./api/order')

// Order Admin 
const orderAdminRoutes = require('./api/admin/order')

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((e) => {
    console.log(`Not connected to database ${e}`);
  });

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.use("/api", auth);
app.use("/api", adminAuth);
app.use("/api", category);
// app.use("/api", product);
app.use("/api", productRoutes)
app.use("/api", initialData);
app.use("/api", cart);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes)
app.use("/api", orderAdminRoutes)

http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })
