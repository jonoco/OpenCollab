var myApp = angular.module('myApp', 
  ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/welcome.html',
    controller:  'WelcomeController'  
  })
  .when('/start', {
  	templateUrl: 'views/make-collab.html',
  	controller: 'MakeController'
  })
  .when('/collaborations', {
    templateUrl: 'views/directory.html',
    controller: 'DirectoryController'
  })
  .when('/collaborations/:project', {
    templateUrl: 'views/collaboration.html',
    controller: 'CollaborationController'
  })
  .when('/user', {
    templateUrl: 'views/user.html',
    controller: 'UserController'
  })
  .otherwise({
      redirectTo: '/'
  });
}]);