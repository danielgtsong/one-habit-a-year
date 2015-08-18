angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc, ApplicationSvc) {

    $scope.KEEP_ME_LOGGED_IN = true
    // console.log('KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)
    
    // if($scope.KEEP_ME_LOGGED_IN == false) {
    //     console.log('IM LOGGING OUT')
    //     window.localStorage.token = null
    //     ApplicationSvc.removeTokenFromHeaders();
    //     $scope.currentUser = null
    //     console.log('LOGOUT token ', window.localStorage.token)
    //     console.log('LOGOUT USER ', $scope.currentUser)
    // }

    $scope.switchLoginStatus = function() {
        // console.log('switchLoginStatus ')
         $scope.KEEP_ME_LOGGED_IN = false
         // console.log('switchLoginStatus KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)

         // console.log('IM LOGGING OUT')
        window.localStorage.token = null
        ApplicationSvc.removeTokenFromHeaders();
        $scope.currentUser = null
        // console.log('LOGOUT token ', window.localStorage.token)
        // console.log('LOGOUT USER ', $scope.currentUser)
    }

  if($scope.KEEP_ME_LOGGED_IN == true && window.localStorage.token != 'null') {
    // console.log('if KEEP_ME_LOGGED_IN == ', $scope.KEEP_ME_LOGGED_IN)
    // console.log('token is not null ', window.localStorage.token != 'null')
    // console.log('ApplicationCtrl- logging in with token')
    // console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
    var token = window.localStorage.token
    var user = UserSvc.getUserWithToken(token)
    .then(function(response) {
        // console.log('[application.ctrl.js] user: ', response.data)
        $scope.$emit('login', response.data)
    });
  }

  $scope.$on('login', function(_, user) {
    $scope.currentUser = user
    FormsSvc.setUser(user)
    setTimeout(function() {
        $scope.KEEP_ME_LOGGED_IN = true
        // console.log('KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)
    }, 100) 
  })

})
