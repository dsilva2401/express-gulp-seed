var express = require('express'),
	router = express.Router(),
	getModuleFiles = require('../../useful/getModuleFiles'),
	models = require('../models');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res, next) {
	// models.Article.findAll().then(function (articles) {
	// });
	res.render('material-angular-layout', {
		title: 'home',
		module: 'home',
		scripts: getModuleFiles('home')
	});
});
