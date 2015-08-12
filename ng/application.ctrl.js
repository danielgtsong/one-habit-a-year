angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc) {
  if(window.localStorage.token) {
  	// console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
  	var token = window.localStorage.token

  	// var user = UserSvc.getUser(token)
  	// console.log('application ctrl - user ', user)
  	// $scope.currentUser = user

  	// var user = UserSvc.loginWithToken(token)
  	$scope.user = LoginSvc.loginWithToken(token).then(function(response) {
      $scope.user_data = response.data;
    });
  	
  	setTimeout(function() {
  		// console.log('ApplicationCtrl - user ', $scope.user)
  		// console.log('ApplicationCtrl - user_data ', $scope.user_data)
  		$scope.currentUser = $scope.user_data
  		FormsSvc.setUser($scope.user_data)
  	},50)
  }

  $scope.$on('login', function(_, user) {
  	console.log('[application.ctrl.js] currentUser set')
    $scope.currentUser = user
    FormsSvc.setUser(user)
  })
})
