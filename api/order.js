const express = require('express');
const router = express.Router();
const { addOrder, getOrders, getOrder } = require('../controller/order');
const {requireSignIn, userMiddleware } = require('../middleware')

router.post("/addOrder", requireSignIn, userMiddleware, addOrder);
router.get("/getOrders", requireSignIn, userMiddleware, getOrders);
router.get("/getOrder/:orderId", 
 requireSignIn, userMiddleware, 
   getOrder
 )
module.exports = router
