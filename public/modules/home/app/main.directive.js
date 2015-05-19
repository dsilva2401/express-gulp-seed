(function(ang) {

	var app = ang.module('app');

	app.directive('home', [function() {
		return {
			restrict: 'C',
			templateUrl: 'modules/home/app/main.html',
			controller: 'appContainer'
		};
	}]);

})(angular)