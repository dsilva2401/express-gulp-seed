var express = require('express'),
	router = express.Router(),
	getModuleFiles = require('../../useful/getModuleFiles'),
	models = require('../models');

module.exports = function (app) {
	app.use('/', router);
};

router.all('/*', function (req, res, next) {
	models.User.verifySession(req).then(function (user) {
		req.currentUser = user;
		next();
	}).catch(function(error) {
		console.log(error);
		res.end();
	});
});

router.get('/', function (req, res, next) {
	if (!req.currentUser) {
		res.redirect('/login');
		return;
	}

	res.render('angular-layout', {
		title: 'home',
		module: 'home',
		scripts: getModuleFiles('home')
	});
});
