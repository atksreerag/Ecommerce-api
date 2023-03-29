const express = require('express');
const router = express.Router();
//const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const repository = require('../repository/profile.repository');
//const couponRepository = require('../repository/products/coupon.repository');


router.post('/', auth, (req, res, next) => {
	repository.createProfile(req, res, next);
});

router.put('/', auth, (req, res, next) => {
	repository.updateProfile(req, res, next);
});

router.get('/', auth, (req, res, next) => {
	repository.getProfile(req, res, next);
});

module.exports = router;