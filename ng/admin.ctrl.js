angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  $scope.users = []
  $scope.teams = []
  $scope.members = []

  AdminSvc.fetchUsers().success(function (users) {
    $scope.users = users
  })
  AdminSvc.fetchTeams().success(function (teams) {
    $scope.teams = teams
  })

  $scope.addMember = function(username) { // inefficient function
    var i = 0
    var found = false
    var member = {}
    do {
        if ($scope.users[i].username == username) {
          member = $scope.users[i]
          found = true
        }
        i++;
    }
    while (i < $scope.users.length && !found);
  	
    // console.log('[admin.ctrl.js] $scope.users: ' + JSON.stringify($scope.users))
    // console.log('[admin.ctrl.js] member: ' + JSON.stringify(member))
    $scope.members.unshift(member)
  }

  $scope.removeMember = function(member) {
    for (var i = 0; i < $scope.members.length; i++ ) {
      if ($scope.members[i] == member) {
        $scope.members.splice(i, 1);
        return;
      }
    }
  }
  
  $scope.addTeam = function() {
    if ($scope.team_name && $scope.year && $scope.group_number && $scope.category && $scope.members) {
      // $http.post('/api/posts', {
      AdminSvc.createTeam({
        team_name: $scope.team_name,
        year: $scope.year,
        group_number: $scope.group_number,
        category: $scope.category,
        members: $scope.members
      }).success(function (team) {
        $scope.teams.unshift(team)
        $scope.team_name = null
        $scope.year = null
        $scope.group_number = null
        $scope.category = null
        $scope.members = null
      })
    }
  }

  // $scope.login = function(username, password) {
  //   AdminSvc.login(username, password)
  //   .then(function (response) {
  //     $scope.$emit('login', response.data)
  //   })
  // }
})