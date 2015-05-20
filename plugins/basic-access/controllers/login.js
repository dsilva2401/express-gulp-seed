var express = require('express'),
	router = express.Router(),
	getModuleFiles = require('../../useful/getModuleFiles'),
	models = require('../models');

module.exports = function (app) {
	app.use('/login', router);
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
	if (req.currentUser) {
		res.redirect('/');
		return;
	}
	res.render('material-angular-layout', {
		title: 'login',
		module: 'login',
		scripts: getModuleFiles('login')
	});
});

router.post('/', function (req, res, next) {
	if (req.currentUser) {
		res.end();
		return;
	}
	var userData = req.body;
	models.User.validateCredentials({
		email: userData.email,
		password: userData.password,
	}).then(function(user) {

		user.createSession (res, function() {
			res.json( user );
		}).catch(function (error) {
			console.log(error);
			res.end();
		});

	}).catch(function (error) {
		console.log(error);
		res.end();
	});
});
