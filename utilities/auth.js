// const winston = require('winston');
// const cache = require('../services/redis-pool.service');
// const variables = require('../config/variables.json');


// /**
//  * Generate OTP for user login / delete account
//  * OTP will be stored to cache with given TTL
//  * @param {string} phone 
//  * @param {string} type
//  * @param {boolean} resend
//  * @returns {number} otp
//  */
// exports.generateOTP = async (phone, type, resend=false) => {
// 	try {

// 		if (type == 'deleteAccount') var otpCacheName = 'OTP_DEL_ACC_';
// 		else otpCacheName = 'OTP_';

// 		if (resend) {
// 			var lastOTP = await cache.get(`${otpCacheName}${phone}`);

// 			if (lastOTP) {
// 				var otp = lastOTP;
// 			} else {
// 				otp = Math.floor(Math.random() * 900000 + 100000);
// 			}

// 		} else {
// 			otp = Math.floor(Math.random() * 900000 + 100000);
// 		}
        
// 		cache.set(otpCacheName + phone, otp, variables.OTP_TTL);
        
// 		// Store number of OTPs generated for throttling user activity
// 		var numberOfOTPsGenerated = Number(await cache.get('otp_generate_count_' + phone));
        
// 		if (!numberOfOTPsGenerated) numberOfOTPsGenerated = 0;
        
// 		cache.set(
// 			'otp_generate_count_' + phone,
// 			numberOfOTPsGenerated + 1,
// 			variables.OTP_GENERATE_MAX_TRY_COOLDOWN
// 		);
        
// 		return otp;
// 	} catch (error) {
// 		winston.error('generateOTP Function Error', error);
// 		return null;
// 	}
// };


// /**
//  * Check if User has exceeded count of maximum OTP Generation
//  * @param {number} phone 
//  * @returns boolean
//  */
// exports.isUserOTPLimitExceeded = async (phone) => {
// 	try {
// 		let invalidOTPs = await cache.get('otp_generate_count_' + phone);
        
// 		if (invalidOTPs > 4) return true;
        
// 		return false;
// 	} catch (error) {
// 		winston.error('isUserOTPLimitExceeded Function Error', error);
// 		return null;
// 	}
// };

// /**
//  * Check if User has exceeded count of maximum OTP submission
//  * @param {number} phone 
//  * @returns boolean
//  */
// exports.isUserLoginAttemptsExceeded = async (phone) => {
// 	try {
// 		let invalidTries = await cache.get('otp_invalid_tries_' + phone);

// 		if (invalidTries > variables.OTP_RETRY_COUNT) return true;
        
// 		return false;
        
// 	} catch (error) {
// 		winston.error('isUserLoginAttemptsExceeded Function Error', error);
// 		return null;
// 	}
// };

// /**
//  * Delete Invalid OTP Tries Count from cache
//  * @param {number} phone
//  */
// exports.deleteInvalidAttempts = async (phone) => {
// 	try {
// 		// cache.delete('otp_generate_count_' + phone);
// 		cache.delete('otp_invalid_tries_' + phone);

// 		return 'success';
// 	} catch (error) {
// 		winston.error('deleteInvalidAttempts Function Error', error);
// 		return null;
// 	}
// };

// /**
//  * Update invalid login attempts in cache
//  * @param {number} phone
//  */
// exports.markAsInvalidAttempt = async (phone) => {
// 	try {
// 		let numberOfTries = Number(await cache.get('otp_invalid_tries_' + phone));

// 		if (!numberOfTries) numberOfTries = 0;

// 		cache.set(
// 			'otp_invalid_tries_' + phone, 
// 			numberOfTries + 1,
// 			variables.OTP_MAX_TRY_COOLDOWN
// 		);

// 		return 'success';
// 	} catch(error) {
// 		winston.error('markAsInvalidAttempt Function Error', error);
// 		return null;
// 	}
// };
