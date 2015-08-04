myApp.controller('NavController', function(
  $scope, $location) {

	var loggedIn = Parse.User.current();
	if (loggedIn) {
		$scope.loggedIn = loggedIn;
	} else {
		$scope.loggedIn = false;
	}

	$scope.logout = function() {
		Parse.User.logOut();
		console.log('Logged out');
		$location.path('/');
	}

});