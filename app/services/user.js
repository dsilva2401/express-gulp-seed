var models = require('../models');

module.exports = function (router) {
	
	// GET
		router.get('/users', function (req, res, next) {
			models.User.findAll().then(function (users) {

				res.json(users);
				
			});
		});

		router.get('/users/:userId', function (req, res, next) {
			models.User.findOne( req.params.userId ).then(function (user) {

				res.json(user);
				
			});
		});

}