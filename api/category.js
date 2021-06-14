const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const {addCategory, getCategories, updateCategories, deleteCategories} = require('../controller/category')
const {requireSignIn, adminMiddleware } = require('../middleware')

const shortid = require('shortid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-'+ Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage: storage})


router.post('/category/create', requireSignIn, adminMiddleware, upload.single('categoryImage'), addCategory);
router.get('/category/categories', getCategories);
router.post('/category/update', upload.single('categoryImage'), updateCategories);
router.post('/category/delete', deleteCategories);

module.exports = router;
