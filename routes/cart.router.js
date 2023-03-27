const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
//const couponRepository = require('../repository/products/coupon.repository');
const repository = require('../repository/cart.repository'); 


router.post('/', auth, (req, res, next) => {
	repository.addToCart(req, res, next);
});

router.get('/', auth, (req, res, next) => {
	repository.getCart(req, res, next);
});

router.delete('/:id', auth, (req, res, next) => {
	repository.deleteCartProduct(req, res, next);
});


module.exports = router;