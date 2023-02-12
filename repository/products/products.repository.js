const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const { Products } = require('../../models/products');


exports.createProduct = asyncMiddleware(async (req, res, next) => {
	console.log('pasd');
	var data = req.body;

	let schema = new Products(data);

	console.log('God', schema);
	await schema.save();


	let response = Response('success');
	return res.send(response);
});