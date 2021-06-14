const Page = require('../../models/page')


exports.createPage = async (req, res) => {
  try {
    const { banners, products } = req.files;

    if (banners.length > 0) {
      req.body.banners = banners.map((banner, index) => ({
        img: `/public/${banner.filename}`,
        navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
      }));
    }
    if (products.length > 0) {
      req.body.products = products.map((product, index) => ({
        img: `/public/${product.filename}`,
        navigateTo: `/productClicked?categoryId=${req.body.product}&type=${req.body.type}`,
      }));
    }

    req.body.createdBy = req.user.id
    Page.findOne({category: req.body.category})
    .exec((error, page) => {
      if (error) return res.status(400).send(JSON.stringify({error}))
      if (page) {
        Page.findOneAndUpdate({category: req.body.category}, req.body, {new: true})
        .exec((error, updatedPage) => {
          console.log(error)
          if (error) return res.status(400).send(JSON.stringify({error}))
                if (updatedPage) {
                    return res.status(201).send(JSON.stringify({page: updatedPage}))
                }
            })
        } else {
          
            const page = new Page(req.body)
            page.save((error, page) => {
                if (error) return res.status(400).send(JSON.stringify({error}))
                if (page) {
                    return res.status(201).send(JSON.stringify({page}))
                }
            })
        }
    })

  } catch (error) {
      return res.status(400).send(JSON.stringify({error: `debug ${error}`}))
  }
};

exports.getPage = (req, res) => {
    const {category, type} = req.params
    if (type === "page") {
        Page.findOne({category: category})
        .exec((error, page) => {
            if (error) return res.status(400).send(JSON.stringify({error}))
            if (page) return res.status(200).json({page})
        })
    }
}