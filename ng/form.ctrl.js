angular.module('app').controller('FormCtrl', function($scope, FormsSvc) {
  // $scope.forms = []
  $scope.user = $scope.currentUser
  $scope.habit = $scope.user.current_habit // set to the current user's habit
  $scope.week = FormsSvc.getCurrentWeek() // set to the current week

  $scope.addForm = function() {
      FormsSvc.create({
        user: $scope.user.username,
        category: $scope.user.habit.category,
        habit: $scope.user.habit.current_habit,
        timesperweek: $scope.user.habit.timesperweek,
        week: $scope.week      
      }).success(function (form) {
        $scope.user = null
        $scope.category = null
        $scope.habit = null
        $scope.week = null  
      })
  }
  // FormsSvc.fetch().success(function (forms) {
  //   $scope.forms = forms
  // })
})