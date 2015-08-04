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
myApp.controller('MakeController', function(
	$scope, $location) {

  $('#make-collab').on('shown.bs.modal', function () {
    $('#nameInput').focus()
  });

  $('.collapse').on('hidden.bs.collapse', function() {
    $("input:text:visible:first").focus();
  });

  var pages = ['#name', '#description', '#category', '#positions', '#available', '#goals', '#details', '#final'];
  var currentPage = 0;

	$scope.project = {};
	$scope.project.positions = [];
	$scope.positionsEmpty = true;
  $scope.header = pages[currentPage];

  $scope.project.creator = Parse.User.current();
  
  $scope.addPosition = function() {

  	$scope.positionsEmpty = false;

  	var role = $scope.role;
  	var experience = $scope.experience;
  	var skill = $scope.skill;
  	var task = $scope.task;
  	var position = {role:role, experience:experience, skill:skill, task:task, available:false};
  	$scope.project.positions.push(position);

  	$scope.role = ""; $scope.experience = ""; $scope.skill = ""; $scope.task = "";
  }

  $scope.nextPage = function() {
  	if (pages[currentPage] == '#final') {
  		
  		console.log($scope.project);

  		var newProject = $scope.project;
      newProject.link = replaceAll(newProject.name, " ", "-");

  		var projectPositions = newProject.positions;
      newProject.positions = null;
  		
      console.log(newProject);

  		var Project = Parse.Object.extend("Project");
			var project = new Project();
      project.set(newProject);

      for (var i = 0 ; i < projectPositions.length ; i++) {

        Member = Parse.Object.extend("Member");
        position = new Member();
        position.set("role", projectPositions[i].role);
        position.set("task", projectPositions[i].task);
        position.set("skill", projectPositions[i].skill);
        position.set("available", projectPositions[i].available);
        position.set("project", project);
        
        position.save(null, {
          success: function(object) {
            
            console.log("success saving position");
            project.relation("members").add(object);

            project.save(null, {
              success: function(object) {
                
                console.log('success saving project');
                console.log(object);
                
                var user = Parse.User.current();
                var relation = user.relation("created");
                relation.add(object);
                user.save();
                // $('#make-collab').modal('hide');

              },
              error: function(model, error) {
                
                console.log('error saving project');
                console.log(error);
              }
            })

          },
          error: function(model, error) {
            console.log("error saving position");
            console.log(error);
          }
        });

      }

      $('#make-collab').modal('hide');

  	} else {

  		currentPage++;
  		$('.collapse').collapse('hide');
  		$(pages[currentPage]).collapse('show');
      $scope.header = pages[currentPage];
  	}
  };// makeProject

  function stripArray(array) {

    var adjustedArray = [];
    for (var i = 0 ; i < array.length ; i++) {
        adjustedArray.push({
          role: array[i].role,
          skill: array[i].skill,
          task: array[i].task,
          available: array[i].available
        });
      }
    return adjustedArray;
  }

  function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  };

  function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };
});
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