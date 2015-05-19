var express = require('express'),
	router = express.Router(),
	fs = require('fs');

module.exports = function(app) {
	app.use('/api', router);
	var routes = router.stack;

	app.get('/api', function (req, res, next) {
		res.render('routes', {
			title: 'Api Routes',
			baseRoute: '/api',
			routes: routes
		});
	});

}

var services = fs.readdirSync(__dirname).filter(function(f) {
	return f!='index.js';
});


services.forEach(function(service) {
	require('./'+service)(router);
});