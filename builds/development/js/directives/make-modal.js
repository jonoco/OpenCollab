myApp.directive('makeProjectModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/make-collab.html',
		controller: 'MakeController'
	}
});