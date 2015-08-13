angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc) {
  if(window.localStorage.token) {
  	// console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
  	var token = window.localStorage.token
  	var user = UserSvc.getUserWithToken(token)
    .then(function(response) {
      // console.log('[application.ctrl.js] response: ', response.data)
      $scope.$emit('login', response.data)
    });
  }

  $scope.$on('login', function(_, user) {
  	// console.log('[application.ctrl.js] currentUser set')
    $scope.currentUser = user
    FormsSvc.setUser(user)
  })
})
