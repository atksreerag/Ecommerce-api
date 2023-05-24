const express = require('express');
const app = express();

// app.get('/', async (req, res, next) => {
// 	console.log('hai');
// 	res.sendFile('./public/index.html', { root: __dirname });
// });


require('dotenv').config();
require('./startup/logging')();
require('./services/database.service')();
require('./startup/routes')(app);


app.get('/', (req, res) => {
	return res.send(
		`SERVER RUNNING...${process.env.TEST_ENV_VARIABLE}`
	);
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`SERVER LISTENING ON PORT ${port}`));
