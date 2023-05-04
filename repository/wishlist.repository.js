const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { Wishlist, validateWishList, validateDeleteWishList } = require('../models/wishList');
const { ObjectId } = require('mongodb');


/**
 * Create WishList
 * @param {Array} id
 * @returns
 */
exports.createWishList = asyncMiddleware(async (req, res, next) => {
	
	const { error } = validateWishList(req.body);
	if(error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;
	let product = ObjectId(data.product[0].id);

	let wishList = await Wishlist.findOneAndUpdate({ user: req.user._id }, { $addToSet: { products: product } });
	
	if (!wishList) {
		try {
			let schema = new Wishlist({
				user: req.user._id,
				products: [ product ]
			});
			await schema.save();
	
		} catch (error) {
			let response = Response('error', 'Error in Creating Wishlist');
			return res.status(response.statusCode).send(response);
		}
	}
	
	let response = Response('success', '');
	return res.status(response.statusCode).send(response);
});


/**
 * View Wishlist
 * @param {Number} page
 * @returns
 */
exports.viewWishList = asyncMiddleware(async (req, res, next) => {

	const PAGE_LIMIT = 5;
	const page_no = Number(req.query.page)  ? Number(req.query.page) : 1;

	let wishList = await Wishlist.aggregate([
		{
			$match: { user: ObjectId(req.user._id) }
		},
		{
			$lookup: {
				from: 'products',
				localField: 'products',
				foreignField: '_id',
				as: 'wishListItems'
			}
		},
		{ 
			$unwind: '$wishListItems'
		},
		{
			$sort: { 'wishListItems.createdAt': -1 }
		},
		{ $skip: PAGE_LIMIT * (page_no - 1) },
		{ $limit: PAGE_LIMIT },
		{
			$project: {
				name: '$wishListItems.name',
				price: '$wishListItems.price',
				description: '$wishListItems.description'
			}
		},
	]);

	let response = Response('success', '', wishList);
	return res.status(res.statusCode).send(response);
});


/**
 * Delete Wishlist Product
 * @param {ObjectId} id
 * @returns
 */
exports.deleteWishList = asyncMiddleware(async (req, res, next) => {

	req.body.id = req.params.id;

	const { error } = validateDeleteWishList(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	await Wishlist.findOneAndUpdate({ user: req.user._id }, { $pull: { products: req.body.id } });

	let response = Response('success');
	return res.status(res.statusCode).send(response);

});