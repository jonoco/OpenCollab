myApp.controller('UserController', function(
	$scope, $location) {

	$scope.user = {
		projects: [],
		collaborations: []
	}

	getProjects();
	getCollaborations();


	function getCollaborations() {
		var query = new Parse.Query("Member");
		query.equalTo("user", Parse.User.current());
		query.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) { 
		      var object = results[i];
		      var id = object.attributes.project.id;
		      var query = new Parse.Query("Project");
					query.equalTo("objectId", id);
					query.first({
					  success: function(project) {
					    console.log('project found');
					    console.log(project);
					    $scope.user.collaborations.push(project);
		     		  $scope.$apply();
					  },
					  error: function(error) {
					    alert("Error: " + error.code + " " + error.message);
					  }
					}); 
		    }
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
	}

	function getProjects() {
		var query = new Parse.Query("Project");
		query.equalTo("creator", Parse.User.current());
		query.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) { 
		      var object = results[i];
		      $scope.user.projects.push(object);
		      $scope.$apply();
		    }
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
	}	
});