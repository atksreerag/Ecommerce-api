const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
//const admin = require('../middlewares/admin');
//const auth = require('../middlewares/auth');
const repository = require('../repository/products/products.repository');
//const couponRepository = require('../repository/products/coupon.repository');
//const multer = require('multer');
const { upload } = require('../middlewares/imageUpload');
// const upload = multer({ storage : storage }).single('image'); 


router.post('/', [ auth, upload ], (req, res, next) => {	
	repository.createProduct(req, res, next);
});

router.get('/', auth, (req, res, next) => {
	repository.listProducts(req, res, next);
});

router.get('/:id', auth, (req, res, next) => {
	repository.listOneProducts(req, res, next);
});

router.put('/:id', [ auth, upload ], (req, res, next) => {
	repository.editProduct(req, res, next);
});

router.delete('/:id', auth, (req, res, next) => {
	repository.deleteProduct(req, res, next);
});

router.post('/:id/like', auth, (req, res, next) => {
	repository.isLiked(req, res, next);
});

router.post('/:id/dislike', auth, (req, res, next) => {
	repository.disLiked(req, res, next);
});

module.exports = router;