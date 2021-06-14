const Category = require("../../models/category");
const Order = require("../../models/order");
const Product = require("../../models/product");

const createCategories = (categories, id = null) => {
  const categoryList = [];
  let category;
  if (id === null) {
    category = categories.filter(cat => cat.parentId == undefined);
  } else {
    category = categories.filter(cat => cat.parentId == id);
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      type: cat.type,
      children: createCategories(categories, cat._id)
    });
  }
  return categoryList;
};

exports.initialData = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select("id name price description quantity slug productPictures category")
    .populate("category", "_id name")
    .exec();
  const orders = await Order.find({})
  .populate("items.productId", "name")
  .exec();
  
  res.status(200).json({
    categories: createCategories(categories),
    products,
    orders,
  });
  } catch (error) {
    res.status(400).json({error: `Unable to get data ${error}`})
  }
  
};
