myApp.directive('registerModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/register.html',
		controller: 'RegistrationController'
	}
});