(function(ang) {

	var app = ang.module('app');

	app.directive('home', [function() {
		return {
			restrict: 'C',
			template: '<h1>:P</h1>'
		};
	}]);

})(angular)