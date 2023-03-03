const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const { Products, validateCreateProduct, validateEditProduct ,
	validateFilterProduct } = require('../../models/products');


exports.createProduct = asyncMiddleware(async (req, res, next) => {
	
	const { error } = validateCreateProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}
	var data = req.body;

	let schema = new Products(data);
	await schema.save();

	let response = Response('success');
	return res.status(response.statusCode).send(response);
});

exports.listProducts = asyncMiddleware(async (req, res, next) => {

	const { error } = validateFilterProduct(req.query);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let query = {};
	if (req.query.name) query.name = new RegExp(req.query.name, 'i');
	if (req.query.price) query.price = req.query.price;

	let products = await Products.find(query).lean();

	let response = Response('success','', { products });
	return res.status(response.statusCode).send(response);
});


exports.listOneProducts = asyncMiddleware(async (req, res, next) => {
	let id = req.params.id;
	let product = await Products.findById(id).lean();

	let response = Response('success','', { product });
	return res.status(response.statusCode).send(response);
});


exports.editProduct = asyncMiddleware(async (req, res, next) => {
	req.body.id = req.params.id;

	let { error } = validateEditProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;

	let updatedData = await Products.findOneAndUpdate({ _id: data.id }, 
		data, 
		{ new: true }		
	);
	if (!updatedData) {
		let response = Response('error', 'Invalid Product');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);
}); 


exports.deleteProduct = asyncMiddleware(async (req, res, next) => {

	let id = req.params.id;

	let product = await Products.findOneAndDelete({ _id: id }).lean();
	if (!product) {
		let response = Response('error', 'Invalid Product');
		return res.status(response.statusCode).send(response);
	}
	
	let response = Response('success');
	return res.status(response.statusCode).send(response);
});