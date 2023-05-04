const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { InitialOrder, validateCreateInitialOrder } = require('../models/initialorder');
const { User } = require('../models/user');
const { Order, validateOrder, validateGetOrder } = require('../models/order');
const { Profile } = require('../models/profile');
const pagination = require('../utilities/pagination');
const Razorpay = require('../services/razorpay.service');


/**
 * Initial Order
 * @param {Number} billAmount
 * @param {String} notes
 * @returns
 */
exports.initialOrder = asyncMiddleware(async (req, res, next) => {

	const { error } = validateCreateInitialOrder(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;

	// Validating User
	const user = await User.findById(req.user._id , '_id');

	if (!user) {
		let response = Response('error', 'Invalid User');
		return res.status(response.statusCode).send(response);
	}

	data.createdBy = user._id;
	data.user = user._id;
	data.paymentInitiatedAt = new Date();
	data.expiry = new Date(new Date().setMinutes(new Date().getMinutes()+30));

	try {
		var initialOrder = new InitialOrder(data);
		initialOrder = await initialOrder.save();

	} catch (error) {
		let response = Response('error', 'Error in initial order creation');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success', '', initialOrder);
	return res.status(response.statusCode).send(response);

});


/**
 * Create Order
 * @param {ObjectId} InitialOrderId
 * @param {Number} billAmount
 * @param {String} type
 * @param {String} name
 * @param {String} address
 * @param {Number} mobile
 * @returns
 */
exports.createOrder = asyncMiddleware(async(req, res, next) => {
	let { error } = validateOrder(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;

	const user = await User.findById(req.user._id , '_id');

	if (!user) {
		let response = Response('error', 'Invalid User');
		return res.status(response.statusCode).send(response);
	}

	let profile = await Profile.findOne({ user: req.user._id });

	const InitialOrderId = await InitialOrder.findById(data.InitialOrderId, '_id');

	if (!InitialOrderId) {
		let response = Response('error', 'Invalid initial order id');
		return res.status(response.statusCode).send(response);
	}

	// Calculating Delivery Date
	let deliveryDate = new Date(new Date().getTime()+(7*24*60*60*1000));
	// Calculating Order Id
	let orderId = Math.random().toString(36).substring(2,12);

	//let orderComplete = false;
	
	if (data.type === 'COD') {

		try {
			var order = new Order({
				billAmount: data.billAmount,
				InitialOrderId: data.InitialOrderId,
				orderId: 'order_'+orderId,
				name: data.name ? data.name : profile.firstName,
				address: data.address ? data.address : profile.address,
				mobile: data.mobile,
				type: data.type,
				status: 'success',
				user: req.user._id,
				isPaymentCompleted: false,
				deliveryDate: deliveryDate
			});
			order = await order.save();
			
		} catch (error) {
			let response = Response('error', 'Error in order creation');
			return res.status(response.statusCode).send(response);
		}
	} else {
		let razorpayOrder = await Razorpay.createOrder(data.amount, data.currency, data.receipt, data.notes);
		if (!razorpayOrder) {
			let response = Response('error', 'Error in Razorpay order creation');
			return res.status(response.statusCode).send(response);
		}
		try {
			order = new Order({
				billAmount: data.billAmount,
				InitialOrderId: data.InitialOrderId,
				orderId: 'order_'+orderId,
				name: data.name ? data.name : profile.firstName,
				address: data.address ? data.address : profile.address,
				mobile: data.mobile,
				type: data.type,
				user: req.user._id,
				isPaymentCompleted: false,
				deliveryDate: deliveryDate,
				order: razorpayOrder.id,
				status: razorpayOrder.status,
				razorpayPayload: [{ orderCreation: razorpayOrder}]
			});
						
			order.createdBy = req.user._id;
			order = await order.save();
		} catch (error) {
			const response = Response('error');
			return res.status(response.statusCode).send(response);
		}
	}

	//orderComplete = true;
	if (order) {
		await InitialOrder.findOneAndUpdate({ user: req.user._id }, { order: order._id, isPaymentCompleted: true });
	}

	let response = Response('success', 'Order placed successfully', order);
	return res.status(response.statusCode).send(response);

});


/**
 * Get Order
 * @param {ObjectId} orderId
 * @returns
 */
exports.viewOrder = asyncMiddleware(async (req, res, next) => {

	let { error } = validateGetOrder(req.query);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let PAGE_LIMIT = 1;
	const pageNo = Number(req.query.page) > 1 ? Number(req.query.page) : 1;

	let query = {};
	if (req.query.id) query._id = req.query.id;
	else query.user = req.user._id;

	let count = await Order.count(query);
	let order = await Order.find(query)
		.sort({ _id: -1 })
		.skip(PAGE_LIMIT * (pageNo - 1))
		.limit(PAGE_LIMIT)
		.lean();

	let response = Response('success', '', { order });
	response = pagination(response, count, PAGE_LIMIT, pageNo);
	return res.send(response);
});