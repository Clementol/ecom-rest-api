const Cart = require("../models/cart");

const runUpdate = (condition, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await Cart.findOneAndUpdate(condition, updateData, {
        upsert: true,
        new: true,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

exports.addItemToCart = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { cartItems } = req.body;
    const user = req.user.id;
    // Check if user have cart already
    await Cart.findOne({ user }).exec(async (error, cart) => {
      if (error) return res.status(400).json({ error });

      if (cart) {
        // if cart exist then update the cart
        let promiseArray = [];
        for (cartItem of cartItems) {
          const isItemAdded = cart.cartItems.find(
            (cat) => cat.product == cartItem.product
          );
          let condition, update;
          if (isItemAdded) {
            condition = { user: user, "cartItems.product": cartItem.product };
            update = {
              $set: {
                "cartItems.$": cartItem,
              },
            };
          } else {
            condition = { user: user };
            update = {
              $push: {
                cartItems: cartItem,
              },
            };
          }
          promiseArray.push(runUpdate(condition, update));
          // Cart.findOneAndUpdate(condition, update , (error, cart) => {
          //     if (error) return res.status(400).send(JSON.stringify(error))
          //     if (cart) {
          //         return res.status(200).send(JSON.stringify({cart: cart}))
          //     }
          // })
        }

        Promise.all(promiseArray)
        .then((res) => res.status(200).json({ res })).catch((error) =>
          res.status(400).json({ error })
        );
      } else {
        // if cart not exist then create new cart
        const newCart = new Cart({
          user: user,
          cartItems: cartItems,
        });
        newCart.save((error, cart) => {
          if (error) return res.status(400).json({ error });

          if (cart) {
            return res.status(200).json({ cart });
          }
        });
      }
    });
  } catch (error) {
    return res.status(400).send(JSON.stringify("Unable to add item to cart"));
  }
};

exports.getCartItems = async (req, res) => {
  const user = req.user.id;
  await Cart.findOne({ user })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            image: item.product.productPictures[0].image,
            price: item.product.price,
            qty: item.quantity,
          };
        });
        res.status(200).json({ cartItems });
      }
    });
};

exports.removeCartItems = async (req, res) => {
  const { productId } = req.body;
  if (productId) {
    Cart.update(
      { user: req.user.id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });

      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
