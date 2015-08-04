myApp.directive('loginModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/login.html',
		controller: 'RegistrationController'
	}
});