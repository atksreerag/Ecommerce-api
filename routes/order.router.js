const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
//const couponRepository = require('../repository/products/coupon.repository');
const repository = require('../repository/order.repository'); 


router.post('/initial-order', auth, (req, res, next) => {
	repository.initialOrder(req, res, next);
});

router.post('/', auth, (req, res, next) => {
	repository.createOrder(req, res, next);
});

router.get('/', auth, (req, res, next) => {
	repository.viewOrder(req, res, next);
});

// get all orders
router.get('/all', admin, (req, res, next) => {
	repository.viewAllOrders(req, res, next);
});

router.post('/verify/order', (req, res, next) => {
	repository.verifyOrder(req, res, next);
});

module.exports = router;