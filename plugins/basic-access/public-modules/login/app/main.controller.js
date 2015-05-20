(function(ang) {

	var app = ang.module('app');

	app.controller('appContainer', ['$scope', '$http', '$mdToast', '$window', function( $scope, $http, $mdToast, $window ) {
		$scope.methods = {};

		$scope.methods.showNotification = function(text) {
			$mdToast.show(
				$mdToast.simple()
					.content(text)
					.position('top right')
					.hideDelay(3000)
			);
		}

		$scope.methods.submit = function() {
			$http({
				url: '/login',
				method: 'POST',
				data: $scope.models.user
			}).then(function(resp) {
				if( !resp || resp.status!=200 ) {
					$scope.methods.showNotification('Error en el inicio de sesión');
					return;
				}
				if( !resp.data ) {
					$scope.methods.showNotification('Credenciales inválidas');
					$scope.models.user.password = '';
					return;
				}
				$window.location = '/';
			});
		}

	}]);

})(angular)