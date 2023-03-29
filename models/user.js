/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const SECRETS = require('../config/secrets');
//const userPermissionSchema = require('./schemas/userPermission.schema');
//const isObjectId = require('./validations/isObjectId');
const winston =  require('winston');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			min: 4,
			required: true
		},
		phone: {
			type: String,		
		},
	},
	{
		timestamps: true
	}
);


userSchema.methods.generateAuthToken = async function() { 
	try {
		// Generate JWT Token 
		await this;

		return jwt.sign(
			{
				_id: this._id,
				name: this.name,
				phone: this.phone,
				
			}, // payload
			SECRETS.JWT_SECRET_KEY, // secret key
			{ expiresIn: '1 days' }
		);

	} catch(error) {
		winston.error('User generateAuthToken Function Error', error);
		return null;
	}
};


userSchema.methods.generateRefreshToken = function() {
	try {

		// Generate JWT Refresh Token
		if (!this.isDeleted && !this.isBlacklisted) {
			return jwt.sign(
				{
					_id: this._id,
					//admin: this.isAdmin,
					
				}, // payload
				SECRETS.JWT_REFRESH_SECRET_KEY, // secret key
				{ expiresIn: '30 days' }
			);
		}
		return '';
	} catch(error) {
		winston.error('User generateRefreshToken Function Error', error);
		return '';
	}
};

exports.User = mongoose.model('User', userSchema);

exports.validateUserSignup = function validateUserSignup(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(128).required(),
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(user);
};


exports.validateUserVerification = function validateUserVerification(data) {
	const schema = Joi.object({
		otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Invalid OTP'}),
		phone: Joi.string().pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateUserLoginVerification = function validateUserLoginVerification(data) {
	const schema = Joi.object({
		otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Invalid OTP'}),
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateUserOTP = function validateUserOTP(data){
	const schema = Joi.object({
		otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Invalid OTP'}),
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateUserSignIn = function validateUserSignIn(data) {
	const schema = Joi.object({
		//isRetailLogin: Joi.boolean().default(false),
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateUserLogin = function validateUserLogin(data) {
	const schema = Joi.object({
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateResendOTP = function validateResendOTP(data) {
	const schema = Joi.object({
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};


exports.validateUserOTP = function validateUserOTP(data) {
	const schema = Joi.object({
		otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Invalid OTP'}),
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
			.messages({'string.pattern.base': 'Phone Number must contain numbers only'})
	});
	return schema.validate(data);
};