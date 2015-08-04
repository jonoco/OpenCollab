myApp.controller('RegistrationController', function(
	$scope, $location) {

	$('#loginModal').on('shown.bs.modal', function () {
    $('#loginEmail').focus()
  });
  $('#registerModal').on('shown.bs.modal', function () {
    $('#registerEmail').focus()
  });

	$scope.login = function() {

		Parse.User.logIn($scope.user.email, $scope.user.password, {
			success: function(user) {
				console.log('successful login');

				$scope.loggedIn = user.attributes.username;
				$('#loginModal').modal('hide');
			},
			error: function(user, error) {
				console.log(error);
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}// login

	$scope.register = function() {

		var user = new Parse.User();
		user.set("username", $scope.user.email);
		user.set("password", $scope.user.password);

		user.signUp(null, {
			success: function(user) {
				console.log('successful singup');

				$scope.loggedIn = user.attributes.username;
				$('#registerModal').modal('hide');
			},
			error: function(user, error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}// register
});