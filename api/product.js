const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { requireSignIn, adminMiddleware } = require("../middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
} = require("../controller/product");
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// console.log(path.dirname(__dirname))
router.post(
  "/product/create",
  requireSignIn,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

router.get("/products/:slug", getProductsBySlug);
router.get(
  "/product/getProducts",
  requireSignIn,
  adminMiddleware,
  getProducts
  );
  router.delete(
    "/product/deleteProductById/:productId",
    requireSignIn,
    adminMiddleware,
    deleteProductById
    );
router.get("/product/:productId", getProductDetailsById);
module.exports = router;
