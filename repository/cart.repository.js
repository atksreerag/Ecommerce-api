const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { Cart, validateCart, validateCartProduct } = require('../models/cart');
const { default: mongoose } = require('mongoose');


/**
 * Add to Cart
 * @param {Array} item
 * @returns
 */
exports.addToCart = asyncMiddleware(async (req, res, next) => {
	
	const { error } = validateCart(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}
	var data = req.body;
	data.user = req.user._id;

	let product = await Cart.findOne({ 'item.product': data.item[0].product });
	if (product) {
		console.log('in');
		let response = Response('success', 'This Product Is Already Added');
		return res.status(response.statusCode).send(response);
	}
	
	let cart = 	await Cart.updateOne({ user: data.user }, {
		$push: { item: data.item } 
	});

	if (!cart) {
		let schema = new Cart(data);
		await schema.save();
	}
	
	let response = Response('success');
	return res.status(response.statusCode).send(response);
});


/**
 * Get Cart
 * @returns {Array}
 */
exports.getCart = asyncMiddleware(async (req, res, next) => {

	let cart = await Cart.aggregate([
			
		{
			$match: {
				user: mongoose.Types.ObjectId(req.user._id) 
			}
		},
	
		{
			$unwind: {
				path: '$item'
			}
		},
		{
			$lookup: {
				from: 'products',
				localField: 'item.product',
				foreignField: '_id',
				as: 'products.product'
			}
		},
		{
			$unwind: '$products.product'
			
		},
		{
			$addFields: {
				price: { $sum: { $multiply: ['$item.quantity', '$products.product.price'] } }
			}
		},
		
		{
			$project:{
				_id: '$products.product._id',
				name: '$products.product.name',	
				quantity: '$item.quantity',					
				
				
			}
		},
	]);

	let response = Response('success', '', cart);
	return res.status(response.statusCode).send(response);
});



/**
 * Delete Cart Product
 * @param {ObjectId} id
 * @returns
 */
exports.deleteCartProduct = asyncMiddleware(async (req, res, next) => {
	req.body.id = req.params.id;

	const { error } = validateCartProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let product = await Cart.findOneAndUpdate( { user: mongoose.Types.ObjectId(req.user._id),
		'item.product': { $in: mongoose.Types.ObjectId(req.body.id)}  },
	{ $pull: { item: { product: mongoose.Types.ObjectId(req.body.id) } } }, { new: true });
	
	if (!product) {
		let response = Response('success', 'Invalid Product');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);
});
