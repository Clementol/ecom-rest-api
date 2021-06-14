const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");

exports.addOrder = async (req, res) => {
  try {
    const user = req.user.id;
    req.body.user = user;
    req.body.orderStatus = [
      {
        type: "ordered",
        date: new Date(),
        isCompleted: true,
      },
      {
        type: "packed",
        isCompleted: false,
      },
      {
        type: "shipped",
        isCompleted: false,
      },
      {
        type: "delivered",
        isCompleted: false,
      },
    ];
    const order = await new Order(req.body);
    order.save((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Cart.deleteOne({ user }).exec((error, result) => {
          if (error) return res.status(400).json({ error });
        });
        res.status(200).json({ order });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ error });
  }
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.user.id })
    .select("_id paymentStatus paymentType orderStatus items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrder = async (req, res) => {
  console.log(req.params)
  await Order.find({ _id: req.params.orderId })
    // .select("_id paymentStatus items")
    .lean()
    .populate("items.productId", "_id name productPictures")
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });

      if (order) {
        Address.findOne({ user: req.user.id }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find((adr) => adr._id === order.addressId);
        });
        res.status(200).json({ order });
      }
    });
};
