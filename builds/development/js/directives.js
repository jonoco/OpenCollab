myApp.directive('joinCollabModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/join-collab.html',
		controller: 'CollaborationController'
	}
});
myApp.directive('loginModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/login.html',
		controller: 'RegistrationController'
	}
});
myApp.directive('makeProjectModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/make-collab.html',
		controller: 'MakeController'
	}
});
myApp.directive('registerModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/register.html',
		controller: 'RegistrationController'
	}
});