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
			if( $scope.models.user.password != $scope.models.user.repassword ){
				$scope.methods.showNotification('Las contraseñas no coinciden');
				$scope.models.user.password = '';
				$scope.models.user.repassword = '';
				return;
			}
			$http({
				url: '/register',
				method: 'POST',
				data: $scope.models.user
			}).then(function(resp) {
				if( !resp || resp.status!=200 || !resp.data ) {
					$scope.methods.showNotification('Error en el registro');
					return;
				}
				$scope.methods.showNotification('Registro exitoso!');
				$window.location = '/';
			});
		}

	}]);

})(angular)