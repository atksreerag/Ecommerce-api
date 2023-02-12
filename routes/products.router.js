const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
//const auth = require('../middlewares/auth');
const repository = require('../repository/products/products.repository');
//const couponRepository = require('../repository/products/coupon.repository');


router.post('/', (req, res, next) => {
	repository.createProduct(req, res, next);
});

router.get('/', (req, res, next) => {
	repository.listProducts(req, res, next);
});

module.exports = router;