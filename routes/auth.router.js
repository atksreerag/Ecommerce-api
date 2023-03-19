const express = require('express');
//const refresh_token = require('../middlewares/refresh-token');
const router = express.Router();
const repository = require('../repository/auth/auth.repository');
const v2repository = require('../repository/auth/auth.repository');
//const auth = require('../middlewares/auth');


router.post('/signin', (req, res, next) => {
	repository.signIn(req, res, next);
});

router.post('/signup', (req, res, next) => {
	repository.signUp(req, res, next);
});

router.post('/verification', (req, res, next) => {
	repository.userVerification(req, res, next);
});

router.post('/v2/login', (req, res, next) => {
	v2repository.userLogin(req, res, next);
});

router.post('/v2/verification', (req, res, next) => {
	v2repository.userLoginVerification(req, res, next);
});

// router.post('/v2/record-name', auth, (req, res, next) => {
// 	v2repository.updateUsersName(req, res, next);
// });

router.post('/resend', (req, res, next) => {
	repository.resendOTP(req, res, next);
});

//router.post('/refresh', refresh_token);


module.exports = router;