(function(ang) {

	var app = ang.module('app');

	app.controller('appContainer', ['$scope', '$mdSidenav', function( $scope, $mdSidenav ) {
		$scope.models = {};
		$scope.methods = {};
		$scope.methods.toggleSideNav = function() {
			$mdSidenav('left').toggle();
		}

	}]);

})(angular)