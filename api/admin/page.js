const express = require('express');
const { createPage, getPage } = require('../../controller/admin/page');
const {uploadToS3, requireSignIn, adminMiddleware} = require('../../middleware');
const router = express.Router();

router.post('/page/create', requireSignIn, adminMiddleware, uploadToS3.fields([
    {name: "banners"},
    {name: "products"}
]), createPage)

router.get('/page/:category/:type', getPage)
module.exports = router;
