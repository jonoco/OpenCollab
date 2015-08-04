myApp.directive('joinCollabModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/join-collab.html',
		controller: 'CollaborationController'
	}
});