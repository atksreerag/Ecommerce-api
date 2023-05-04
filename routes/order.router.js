const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
//const couponRepository = require('../repository/products/coupon.repository');
const repository = require('../repository/order.repository'); 


router.post('/initial-order', auth, (req, res, next) => {
	repository.initialOrder(req, res, next);
});

router.post('/order', auth, (req, res, next) => {
	repository.createOrder(req, res, next);
});

router.get('/order', auth, (req, res, next) => {
	repository.viewOrder(req, res, next);
});

module.exports = router;