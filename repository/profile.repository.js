const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { Profile, validateProfile, validateUpdateProfile } = require('../models/profile');


/**
 * Create profile
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} address
 * @param {Number} pincode
 * @returns
 */
exports.createProfile = asyncMiddleware(async (req, res, next) => {

	const { error } = validateProfile(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	req.body.user = req.user._id;
	var data = req.body;

	try {
		let schema = new Profile(data);
		await schema.save();
	} catch (error) {
		let response = Response('error', 'Error in Profile Creation');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);

});


/**
 * Update profile
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} address
 * @param {Number} pincode
 * @returns
 */
exports.updateProfile = asyncMiddleware(async (req, res, next) => {

	const { error } = validateUpdateProfile(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;
	data.modifiedOn = Date.now();

	let updatedData = await Profile.findOneAndUpdate({ user: req.user._id }, data, 
		{ new: true }		
	);

	if (!updatedData) {
		let response = Response('error', 'Invalid Profile');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);

});


/**
 * Get Profile
 * @returns {Object} Profile
 */
exports.getProfile = asyncMiddleware(async (req, res, next) => {

	let profile = await Profile.findOne({ user: req.user._id }, '-user');

	if (!profile) {
		let response = Response('error', 'Invalid Profile');
		return res.status(response.statusCode).send(response);
	}
	let response = Response('success', '', profile);
	return res.status(response.statusCode).send(response);

});