module.exports = function (router) {
	
	router.get('/demo', function (req, res, next) {
		res.json({
			data: 123
		});
	});

}