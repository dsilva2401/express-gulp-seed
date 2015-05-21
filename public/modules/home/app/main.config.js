(function(ang) {

	var app = ang.module('app');

	app.config( ['$mdThemingProvider', function( $mdThemingProvider ) {
		$mdThemingProvider.theme('default').primaryPalette('blue');
	}]);

})(angular)