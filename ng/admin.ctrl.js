angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  $scope.users = []
  AdminSvc.fetch().success(function (users) {
    $scope.users = users
  })
})