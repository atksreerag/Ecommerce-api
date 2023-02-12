const express = require('express');
const app = express();
const API_VERSION = '3.0.1';


require('dotenv').config();
require('./startup/logging')();
require('./services/database.service')();
require('./startup/routes')(app);


app.get('/', (req, res) => {
	console.log('ops');
	return res.send(
		`SERVER ${API_VERSION} RUNNING...${process.env.TEST_ENV_VARIABLE}`
	);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`SERVER LISTENING ON PORT ${port}`));
