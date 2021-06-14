const express = require("express");
const {
  updateOrder,
  getCustomerOrders,
} = require("../../controller/admin/order");
const { requireSignIn, adminMiddleware } = require("../../middleware");
const router = express.Router();

router.put("/order/update", requireSignIn, adminMiddleware, updateOrder);
router.get(
  "/order/getCustomerOrders",
  requireSignIn,
  adminMiddleware,
  getCustomerOrders
);
module.exports = router;
