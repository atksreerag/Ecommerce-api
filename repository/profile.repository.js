const asyncMiddleware = require('../middlewares/asyncMiddleware');
const Response = require('../middlewares/response');
const { Profile, validateProfile, validateUpdateProfile } = require('../models/profile');


exports.createProfile = asyncMiddleware(async (req, res, next) => {

	const { error } = validateProfile(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	try {
		let schema = new Profile(req.body);
		await schema.save();
	} catch (error) {
		let response = Response('error', 'Error in Profile Creation');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);

});


exports.updateProfile = asyncMiddleware(async (req, res, next) => {

	req.body.id = req.params.id;

	const { error } = validateUpdateProfile(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	let data = req.body;

	let updatedData = await Profile.findOneAndUpdate({ _id: data.id }, data, 
		{ new: true }		
	);

	if (!updatedData) {
		let response = Response('error', 'Invalid Profile id');
		return res.status(response.statusCode).send(response);
	}

	let response = Response('success');
	return res.status(response.statusCode).send(response);

});