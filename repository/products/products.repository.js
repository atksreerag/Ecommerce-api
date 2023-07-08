const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const { Products, validateCreateProduct, validateEditProduct ,validateFilterProduct, validateIsLiked, validateDeleteProduct, validateDisLiked } = require('../../models/products');
const telegram = require('../../services/telegram.service');
const pagination = require('../../utilities/pagination');


/**
 * Create Product
 * @param {String} name
 * @param {String} description
 * @param {Number} price
 * @param {String} category
 * @param {files} image
 * @returns
 */
exports.createProduct = asyncMiddleware(async (req, res, next) => {

	const { error } = validateCreateProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}
	
	let data = req.body;
	let images = [];

	for (let i = 0; i < req.files.length; i++) images.push(req.files[i].path);

	let alreadyAdded = data.name;

	alreadyAdded = new RegExp(alreadyAdded, 'i');
	let addedProduct = await Products.findOne({ name: alreadyAdded });
	if (addedProduct) {
		let response = Response('error', 'This Product is Already Added');
		return res.status(response.statusCode).send(response);
	}

	try {
		var schema = new Products({
			name: data.name,
			price: data.price,
			description: data.description,
			category: data.category,
			image: images
		});
		await schema.save();
		
	} catch (error) {
		let response = Response('error', 'Error in add product');
		return res.status(response.statusCode).send(response);
	}

	let message = 'Product Added : \n\n' + JSON.stringify(schema);
	telegram(message);

	let response = Response('success');
	return res.status(response.statusCode).send(response);
});


/**
 * List Product
 * @param {String} name
 * @param {Number} price
 * @param {String} category
 * @returns
 */
exports.listProducts = asyncMiddleware(async (req, res, next) => {

	const { error } = validateFilterProduct(req.query);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	const PAGE_LIMIT = 5;
	const page = Number(req.query.page > 1) ? Number(req.query.page) : 1;

	let query = {};
	if (req.query.name) query.name = new RegExp(req.query.name, 'i');
	if (req.query.price) query.price = req.query.price;
	if (req.query.category) query.category = new RegExp(req.query.category, 'i');

	let count = await Products.count(query);
	let products = await Products.find(query, '-heartUsers')
		.sort({ _id: -1 })
		.limit(PAGE_LIMIT)
		.skip(PAGE_LIMIT * (page - 1))
		.lean();

	let response = Response('success','', { products });
	response = pagination(response, count, PAGE_LIMIT, page);
	return res.send(response);
});


/**
 * List One product
 * @param {ObjectId} id
 * @returns
 */
exports.listOneProducts = asyncMiddleware(async (req, res, next) => {
	let id = req.params.id;
	let product = await Products.findById(id).lean();

	let response = Response('success','', { product });
	return res.status(response.statusCode).send(response);
});


/**
 * Edit Product
 * @param {ObjectId} id
 * @param {String} name
 * @param {String} description
 * @param {Number} price
 * @param {String} category
 * @param {files} image
 * @returns
 */
exports.editProduct = asyncMiddleware(async (req, res, next) => {
	req.body.id = req.params.id;

	let { error } = validateEditProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;
	data.image = req.file.path;

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


/**
 * Delete Product
 * @param {Objectid} id
 * @returns
 */
exports.deleteProduct = asyncMiddleware(async (req, res, next) => {
	req.body.id = req.params.id;

	const { error } = validateDeleteProduct(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}
	let id = req.body.id;

	let product = await Products.findOneAndDelete({ _id: id }).lean();
	if (!product) {
		let response = Response('error', 'Invalid Product');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);
});


/**
 * Is Liked Product
 * @param {Boolean} isLiked
 * @returns
 */
exports.isLiked = asyncMiddleware(async (req, res, next) => {

	req.body.id = req.params.id;
	const { error } = validateIsLiked(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;

	if (data.isLiked) {

		let updatedData = await Products.findOneAndUpdate({ _id: data.id, 'heartUsers.user': { $nin: [ req.user._id ] } },
			{
				$addToSet: { heartUsers: { user: req.user._id } }, $inc: { hearts: 1 }
			});

		if (!updatedData) {
			let response = Response('error', 'Already Liked');
			return res.status(response.statusCode).send(response);
		}

		let response = Response('success', 'You Liked This Product');
		return res.status(response.statusCode).send(response);
	}
	
	let response = Response('error');
	return res.status(response.statusCode).send(response);
});


// exports.disLiked = asyncMiddleware(async(req, res, next) => {

// 	req.body.id = req.params.id;
// 	const { error } = validateIsLiked(req.body);
// 	if (error) {
// 		let response = Response('error', error.details[0].message);
// 		return res.status(response.statusCode).send(response);
// 	}

// 	let data = req.body;
// 	if (data.isLiked === false) {
// 		//await 
// 	}
// });