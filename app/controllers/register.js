var express = require('express'),
	router = express.Router(),
	getModuleFiles = require('../../useful/getModuleFiles'),
	models = require('../models');

module.exports = function (app) {
	app.use('/register', router);
};

router.get('/', function (req, res, next) {
	// models.Article.findAll().then(function (articles) {
	// });
	res.render('angular-layout', {
		title: 'register',
		module: 'register',
		scripts: getModuleFiles('register')
	});
});
