angular.module('app').controller('ApplicationCtrl', function($scope) {
  $scope.$on('login', function(_, user) {
  	console.log('[application.ctrl.js] currentUser set')
    $scope.currentUser = user
  })
})
