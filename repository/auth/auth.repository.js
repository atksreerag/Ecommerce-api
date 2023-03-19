const {
	User, validateUserSignup, validateUserVerification,
	validateUserSignIn, validateResendOTP
} = require('../../models/user');
const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const cache = require('../../services/redis-pool.service');
//const sendOTP = require('../../services/otp-sms.service');
const config = require('../../config/config');
const Response = require('../../middlewares/response');
const auth = require('../../utilities/auth');

//const { isAuthDeviceIdLimitExceeded, authSaveDeviceId } = require('../../utilities/auth-device-id-restrict');


/**
 * User SignIn (Generate OTP)
 * Check for OTP/Login Attempts limit
 * If valid and User Registered, send OTP to Phone Number
 */
exports.signIn = asyncMiddleware(async (req, res, next) => {
	// User SignIn
	const { error } = validateUserSignIn(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

	const { phone } = req.body;
	// if (await auth.isUserOTPLimitExceeded(phone) || await auth.isUserLoginAttemptsExceeded(phone)) {
	// 	let response = Response(
	// 		'error',
	// 		'You\'ve reached maximum login attempts, Please try again after some time.'
	// 	);
	// 	return res.status(response.statusCode).send(response);
	// }

	// if (await isAuthDeviceIdLimitExceeded(phone, req)) {
	// 	let response = Response('error', config.AUTH_IP_LIMIT_ERROR_MESSAGE);
	// 	return res.status(response.statusCode).send(response);
	// }

	const user = await User.findOne({ phone: phone }, '_id');

	// User not registered
	if (!user) {
		let response = Response('error', 'Phone Number is not registered');
		return res.status(response.statusCode).send(response);
	}

	// BlackListed User
	// if (user.isBlacklisted) {
	// 	track(
	// 		user._id, 'request_otp_failed',
	// 		{ 
	// 			phone: phone,
	// 			is_retail_login: req.body.isRetailLogin,
	// 			error_message: 'blacklisted'
	// 		}
	// 	);

	// 	let response = Response('error', 'Invalid User');
	// 	return res.status(response.statusCode).send(response);
	// }

	// Check if User is a valid retailer
	// if (req.body.isRetailLogin && !(user.isRetailer && user.clubOwned)) {
	// 	track(
	// 		user._id, 'request_otp_failed',
	// 		{ 
	// 			phone: phone,
	// 			is_retail_login: req.body.isRetailLogin, 
	// 			error_message: 'not_a_retailer'
	// 		}
	// 	);

	// 	let response = Response('error', 'User is not a Retailer');
	// 	return res.status(response.statusCode).send(response);
	// }

	// Set default OTP for Development Environment
	if(config.ENVIRONMENT === 'alpha') {
		var otp = '123456';
		cache.set('OTP_' + phone, otp, 300);
	} else if (phone == '9048282451' || phone == '9876543210') {
		otp = '815896';
		cache.set('OTP_' + phone, otp, 300);
	} else {
		//otp = await auth.generateOTP(phone);

		//sendOTP(phone, otp);
	}

	// track(
	// 	user._id, 'request_otp_success',
	// 	{ phone: phone, otp: otp, is_retail_login: req.body.isRetailLogin }
	// );

	let response = Response(
		'success', 'Signup Successfully',
		{ 
			otp: otp,
			//token: token,
			//refresh_token: refresh_token,
		}
	);

	return res.status(response.statusCode).send(response);
});


/**
 * User sign up
 * Find is user already registered, if not check for OTP/Login Attempts limit
 * If valid, send OTP to Phone Number
 */
exports.signUp = asyncMiddleware(async (req, res, next) => {
	// validate
	const { error } = validateUserSignup(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);

		return res.status(response.statusCode).send(response);
	}

	const { phone } = req.body;

	let user = await User.findOne(
		{ phone: phone },
		' _id name phone'
	).populate('name').exec();
	console.log('user', user);

	if (!user) {
		user = new User({
			name: req.body.name,
			phone: phone
		});
		user = await user.save();
	}

	// Check Device Id Restriction
	// if (await isAuthDeviceIdLimitExceeded(phone, req)) {
	// 	let response = Response('error', config.AUTH_IP_LIMIT_ERROR_MESSAGE);
	// 	return res.status(response.statusCode).send(response);
	// }

	// Check is user registered
	// if (await User.exists({ phone: phone, isDeleted: false })) {
	// 	let response = Response(
	// 		'error', 
	// 		'Phone Number already registered'
	// 	);
	// 	return res.status(response.statusCode).send(response);
	// }

	// Check for invalid user tries
	// if (await auth.isUserOTPLimitExceeded(phone) || await auth.isUserLoginAttemptsExceeded(phone)) {
	// 	let response = Response(
	// 		'error', 
	// 		'You\'ve reached maximum login attempts, Please try again after some time.'
	// 	);
	// 	return res.status(response.statusCode).send(response);
	// }

	// Set default OTP for Development Environment
	if (config.ENVIRONMENT === 'alpha') {
		var otp = '123456';
		cache.set('OTP_' + phone, otp, 300);
	} else if (phone == '9048282451') {
		otp = '815896';
		cache.set('OTP_' + phone, otp, 300);
	} else {
		//const otp = await auth.generateOTP(phone);

		//await sendOTP(phone, otp);
	}

	let response = Response(
		'success', 'Signup Successfully',
		{ 
			otp: otp,
			//token: token,
			//refresh_token: refresh_token,
		}
	);

	return res.status(response.statusCode).send(response);

	//return res.send(Response('success'));
});


/**
 * Verify User SignUp
 * Phone Number is verified via OTP
 * If valid, check for Login Attempts limit
 * If user not registered, create new User
 * Send JWT Token as Response
 */
exports.userVerification = asyncMiddleware(async (req, res, next) => {

	const { error } = validateUserVerification(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(400).send(response);
	}

	const { phone } = req.body;
	// if (await auth.isUserLoginAttemptsExceeded(phone)) {
	// 	let response = Response(
	// 		'error',
	// 		'You\'ve reached maximum login attempts, Please try again after some time.'
	// 	);
	// 	return res.status(response.statusCode).send(response);
	// }

	// Get OTP from cache
	const otp = await cache.get(`OTP_${phone}`);
	if (!otp) {
		let response = Response('error', 'OTP Expired');
		return res.status(response.statusCode).send(response);
	}

	// Check otp with user entered otp
	if (req.body.otp != otp) {
		//auth.markAsInvalidAttempt(phone);

		let response = Response('error', 'Invalid OTP');
		return res.status(response.statusCode).send(response);
	}

	let user = await User.findOne(
		{ phone: phone },
		' _id name phone'
	).populate('name').exec();
	console.log('user', user);

	// if (!user) {
	// 	user = new User({
	// 		name: req.body.name,
	// 		phone: phone
	// 	});
	// 	user = await user.save();

	// 	var userEarnCoins = await coins.userEarnCoins(user._id, signUpBonusCoins, 'signUp');
	// 	var coinsEarned = userEarnCoins.coinsEarned;

	// 	track(user._id, 'earned_signup_coins', { coins: coinsEarned });

	// 	Updating Coins temporarily in User Model (to avoid db query)
	// 	JWT Token requires Coins
	// 	user.coins = coinsEarned;
	// }

	//identify(user._id, { name: user.name, phone: phone });

	// BlackListed User
	// if (user.isBlacklisted) {
	// 	track(
	// 		user._id, 'otp_verification_failed',
	// 		{ 
	// 			phone: phone,
	// 			is_registration: req.body.isRegistration,
	// 			is_retail_login: req.body.isRetailLogin, 
	// 			otp: req.body.otp,
	// 			error_message: 'blacklisted'
	// 		}
	// 	);
        
	// 	let response = Response('error', 'Invalid User');
	// 	return res.status(response.statusCode).send(response);
	// }

	// Check if User is a valid retailer
	// if ( req.body.isRetailLogin && !(user.isRetailer && user.clubOwned) ) {
	// 	track(
	// 		user._id, 'otp_verification_failed',
	// 		{ 
	// 			phone: phone,
	// 			is_registration: req.body.isRegistration,
	// 			is_retail_login: req.body.isRetailLogin, 
	// 			otp: req.body.otp,
	// 			error_message: 'not_a_retailer'
	// 		}
	// 	);

	// 	let response = Response('error', 'User is not a Retailer');
	// 	return res.status(response.statusCode).send(response);
	// }

	const token = await user.generateAuthToken();
	const refresh_token = await user.generateRefreshToken();

	// // Token not generated
	// if (!token || !refresh_token) {
	// 	track(
	// 		user._id, 'otp_verification_failed',
	// 		{ 
	// 			phone: phone,
	// 			is_registration: req.body.isRegistration,
	// 			is_retail_login: req.body.isRetailLogin, 
	// 			otp: req.body.otp,
	// 			error_message: 'jwt_token_generation_error'
	// 		}
	// 	);

	// 	let response = Response('error', 'Invalid User');
	// 	return res.status(response.statusCode).send(response);
	// }

	//track(user._id, 'otp_verification_success', req.body, true);

	//auth.deleteInvalidAttempts(phone);

	// Save Device Id with Phone
	//authSaveDeviceId(phone, req);

	let response = Response(
		'success', 'Signed In Successfully',
		{ 
			token: token,
			refresh_token: refresh_token,
		// 	signUpCoins: coinsEarned ? coinsEarned : null
		}
	);

	return res.status(response.statusCode).send(response);
});


// /**
//  * Resend OTP
//  */
// exports.resendOTP = asyncMiddleware(async (req, res, next) => {
// 	const { error } = validateResendOTP(req.body);
// 	if (error) {
// 		let response = Response('error', error.details[0].message);

// 		return res.status(response.statusCode).send(response);
// 	}

// 	const phone = req.body.phone;

// 	// Check for invalid user tries
// 	if (await auth.isUserOTPLimitExceeded(phone) || await auth.isUserLoginAttemptsExceeded(phone)) {
// 		let response = Response(
// 			'error', 
// 			'You\'ve reached maximum login attempts, Please try again after some time.'
// 		);
// 		return res.status(response.statusCode).send(response);
// 	}

// 	// Check Device Id Restriction
// 	if (await isAuthDeviceIdLimitExceeded(phone, req)) {
// 		let response = Response('error', config.AUTH_IP_LIMIT_ERROR_MESSAGE);
// 		return res.status(response.statusCode).send(response);
// 	}

// 	// Set default OTP for Development Environment
// 	if (config.ENVIRONMENT === 'alpha') {
// 		var otp = '123456';
// 		cache.set('OTP_' + phone, otp, 300);
// 	} else if (phone == '7012060319' || phone == '9633176699') {
// 		otp = '815896';
// 		cache.set('OTP_' + phone, otp, 300);
// 	} else {
// 		const otp = await auth.generateOTP(phone, null, true);

// 		await sendOTP(phone, otp, true);
// 	}

// 	return res.send(Response('success'));
// });
