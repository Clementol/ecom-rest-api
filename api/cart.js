const express = require('express');
const router = express.Router();
const {addItemToCart, getCartItems, removeCartItems} = require('../controller/cart')
const {requireSignIn, userMiddleware } = require('../middleware')

router.post('/user/cart/addtocart', requireSignIn, userMiddleware,  addItemToCart);
router.get('/user/getCartItems', requireSignIn, userMiddleware, getCartItems)
router.post('/user/cart/removeItem',
 requireSignIn, userMiddleware,
 removeCartItems
 )

module.exports = router
