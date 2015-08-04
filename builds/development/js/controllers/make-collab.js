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