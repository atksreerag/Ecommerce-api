const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { Cart, validateCart, validateGetCart } = require('../models/cart');
const { User } = require('../models/user');
const { Products } = require('../models/products');
const { default: mongoose } = require('mongoose');

exports.addToCart = asyncMiddleware(async (req, res, next) => {
	
	const { error } = validateCart(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}
	var data = req.body;
	data.user = req.user._id;

	let schema = new Cart(data);
	await schema.save();

	let response = Response('success');
	return res.status(response.statusCode).send(response);
});


exports.getCart = asyncMiddleware(async (req, res, next) => {
	console.log('user', req.user._id);

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
				price: { $sum: { $multiply: ['$item.quantity', '$products.product.price'] } },
				
			}
		},
	]);

	let response = Response('success', '', cart);
	return res.status(response.statusCode).send(response);
});
