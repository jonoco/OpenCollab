myApp.controller('WelcomeController', function(
	$scope, $location) {

	$scope.collaborations = [];
	$scope.positions = [];

	loadProjects();
	loadPositions();

	$scope.startCollab = function() {
		if (Parse.User.current() != null) {
			$('#make-collab').modal('show');
		} else {
			console.log('not logged in');
			$('#loginModal').modal('show');
		}
	}

	function loadPositions() {
		var positions = Parse.Object.extend("Member");
		queryPositions = new Parse.Query(positions);
		queryPositions.limit(6);	
		queryPositions.find({
			success: function(results) {
		    
		    console.log(results);
		    for (var i = 0 ; i < results.length ; i++) {
		    	$scope.positions.push(results[i].attributes);
		    }
		    $scope.$apply();
		    
		  },
		  error: function(error) {
		    // alert("Error: " + error.code + " " + error.message);
		    console.log(error);
		  }
		});
	}
	
	function loadProjects() {
		var projects = Parse.Object.extend("Project");
		var query = new Parse.Query(projects);
		query.limit(6);	
		query.find({
			success: function(results) {
		    
		    for (var i = 0 ; i < results.length ; i++) {
		    	$scope.collaborations.push(results[i].attributes);
		    }
		    $scope.$apply();
		    
		  },
		  error: function(error) {
		    // alert("Error: " + error.code + " " + error.message);
		    console.log(error);
		  }
		});
	}
  
});