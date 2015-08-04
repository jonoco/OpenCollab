myApp.controller('DirectoryController', function(
	$scope, $location) {

	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

	var projects = Parse.Object.extend("Project");
	var query = new Parse.Query(projects);
	$scope.collaborations = [];

	query.find({
		success: function(results) {
	    
	    for (var i = 0 ; i < results.length ; i++) {
	    	$scope.collaborations.push(results[i].attributes);
	    	$scope.$apply();
	    }
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

});