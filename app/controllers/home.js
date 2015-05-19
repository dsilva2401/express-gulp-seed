var express = require('express'),
	router = express.Router(),
	getModuleFiles = require('../../useful/getModuleFiles'),
	models = require('../models');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res, next) {
	res.render('angular-layout', {
		title: 'Home',
		module: 'home',
		scripts: getModuleFiles('home')
	});
});