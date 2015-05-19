var express = require('express'),
	router = express.Router(),
	fs = require('fs');

module.exports = function(app) {
	app.use('/api', router);
}

var services = fs.readdirSync(__dirname).filter(function(f) {
	return f!='index.js';
});

services.forEach(function(service) {
	require('./'+service)(router);
});