const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // res.status(200).send(JSON.stringify({file, body}))
  try {
    const { name, price, description, quantity, category, createdBy } =
      req.body;
    let productPictures;
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { image: file.filename };
      });
    }
    const newProduct = new Product({
      name: name,
      slug: slugify(name),
      price: price,
      quantity: quantity,
      description: description,
      productPictures: productPictures,
      category: category,
      createdBy: req.user.id,
    });

    newProduct
      .save()
      .then((product) => {
        if (product) {
          res.status(200).send(JSON.stringify(product));
        }
      })
      .catch((err) => {
        return res.status(400).send(JSON.stringify({ error: err }));
      });
  } catch (error) {
    res.status(400).send(JSON.stringify({ error: error }));
  }
};

exports.getProductsBySlug = (req, res) => {
  // res.setHeader('Content-Type', 'application/json')
  const { slug } = req.params;
  try {
    Category.findOne({ slug: slug })
      .select("_id type")
      .exec((err, category) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        if (!category) {
          return res.status(400).json({ error: err });
        }
        if (category) {
          Product.find({ category: category._id }).exec((err, products) => {
            if (err) {
              return res.status(400).json({ error: err });
            }
            console.log(category);
            if (category.type) {
              if (products.length > 0) {
                res.status(200).json({
                  products,
                  priceRange: {
                    under30k: 30000,
                    under50k: 50000,
                    under80k: 80000,
                    under100k: 100000,
                    under150k: 150000,
                  },
                  productsByPrice: {
                    under30k: products.filter((prod) => prod.price <= 30000),
                    under50k: products.filter(
                      (prod) => prod.price <= 50000 && prod.price >= 31000
                    ),
                    under80k: products.filter(
                      (prod) => prod.price <= 80000 && prod.price > 50000
                    ),
                    under100k: products.filter(
                      (prod) => prod.price <= 100000 && prod.price > 80000
                    ),
                    under150k: products.filter(
                      (prod) => prod.price <= 150000 && prod.price > 100000
                    ),
                  },
                });
              }
            } else {
              res.status(200).json({ products });
            }
          });
        }
      });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    
    const { productId } = req.params;
    console.log(productId);
    if (productId) {
      await Product.deleteOne({ _id: productId }).exec((error, del) => {
        if (error) return res.status(400).json({ error });
        if (del) {
          res.status(202).json({ del });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  } catch (error) {
    res.status(400).json({ error: `Unable to delete ${error}` });

  }
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        return res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "params required" });
  }
};

exports.getProducts = async (req, res) => {
  try {
     await Product.find({})
      .select("id name price quantity slug description productPictures category")
      .populate("category", "_id name")
      .exec((error, products) => {
        if (error) return res.status(400).json({ error });
        if (products) {
          res.status(200).json({ products });
        }
      });
  } catch (error) {
    res.status(400).json({ error:  `${error} nip` });
  }
};
