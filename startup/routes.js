const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const error = require('../middlewares/error');
const product = require('../routes/products.router');
const cart = require('../routes/cart.router');
const profile = require('../routes/profile.router');
const auth = require('../routes/auth.router');
const order = require('../routes/order.router');
const wishlist = require('../routes/wishlist.router');


module.exports = function(app) {
	// app.use(helmet());
	// app.use(cors());
	app.use(express.json({ limit: '2mb' }));
	app.use(express.urlencoded({ limit: '2mb', extended: true }));
	app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

	//app.use(express.static(`${__dirname}/public`));

	app.use(express.static(__dirname + '/public'));
	app.use('/uploads', express.static('uploads'));
	app.use('/auth', auth);
	app.use('/products', product);
	app.use('/carts', cart);
	app.use('/profiles', profile);
	app.use('/orders', order);
	app.use('/wishlists', wishlist);
	app.use(error);
};
