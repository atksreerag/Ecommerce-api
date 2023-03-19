const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
//const auth = require('../middlewares/auth');
const repository = require('../repository/profile.repository');
//const couponRepository = require('../repository/products/coupon.repository');


router.post('/', (req, res, next) => {
	repository.createProfile(req, res, next);
});

router.put('/:id', (req, res, next) => {
	repository.updateProfile(req, res, next);
});

module.exports = router;