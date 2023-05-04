const express = require('express');
const router = express.Router();
const repository = require('../repository/wishlist.repository');
const auth = require('../middlewares/auth');


router.post('/', auth, (req, res, next) => {
	repository.createWishList(req, res, next);
});

router.get('/', auth, (req, res, next) => {
	repository.viewWishList(req, res, next);
});

router.delete('/:id', auth, (req, res, next) => {
	repository.deleteWishList(req, res, next);
});

module.exports = router;