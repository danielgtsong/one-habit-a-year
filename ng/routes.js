angular.module('app').config(function ($routeProvider) {
  // $locationProvider.html5Mode(true)
  $routeProvider
  .when('/', { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/logout', { controller: 'ApplicationCtrl', templateUrl: 'logout.html' })
  .when('/habits', { controller: 'HabitsCtrl', templateUrl: 'habits.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/forms', { controller: 'FormsCtrl', templateUrl: 'forms.html' })
  .when('/admin', { controller: 'AdminCtrl', templateUrl: 'admin.html' })
  .when('/team', { controller: 'AdminCtrl', templateUrl: 'team.html' })
})
