angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc, ApplicationSvc) {

    $scope.KEEP_ME_LOGGED_IN = false
    console.log('IM LOGGING OUT')
    window.localStorage.token = null
    ApplicationSvc.removeTokenFromHeaders();
    $scope.currentUser = null
    console.log('LOGOUT token')
    console.log('LOGOUT USER')

  if(window.localStorage.token) {
    console.log('ApplicationCtrl- logging in with token')
    console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
    var token = window.localStorage.token
    var user = UserSvc.getUserWithToken(token)
    .then(function(response) {
        console.log('[application.ctrl.js] user: ', response.data)
        $scope.$emit('login', response.data)
    });
  }

  $scope.$on('login', function(_, user) {
    $scope.currentUser = user
    FormsSvc.setUser(user)
  })

})
