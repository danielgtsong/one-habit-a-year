angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  
  AdminSvc.fetchUsers().success(function (users) {
    $scope.users = users
  })
  AdminSvc.fetchTeams().success(function (teams) {
    $scope.teams = teams
  })

})