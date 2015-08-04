myApp.controller('CollaborationController', function(
	$scope, $location, $routeParams) {

	$scope.project = {};
	$scope.positions = [];

	var projectLink = $routeParams.project;
	var project = Parse.Object.extend("Project");
	var query = new Parse.Query(project);
	query.equalTo("link", projectLink);
	query.first({
		success: function(results) {
	    
	    console.log('success');
	    console.log(results);
	    $scope.project = results.attributes;
	    $scope.$apply();

	    getPositions(results);

	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

	$scope.requestPosition = function(position) {
		$scope.message = { text:"" };
		console.log(position);
		position.set("user", Parse.User.current());
		position.save({
			success: function(result) {
				$scope.message.text = 'success setting user';
				console.log(result);
				$scope.$apply();
			},
			error: function(model, error) {
				$scope.message.text = 'error: could not set user';
				console.log(error);
				$scope.$apply();
			}
		});

	}

	function getPositions(project) {

		var relation = project.relation("members");
		relation.query().find({
			success: function(list) {
				console.log('success: found members list');
				console.log(list);
				$scope.positions = list;
				$scope.$apply();
				console.log($scope.positions);
			}
		});
	}

});