angular.module('app').controller('FormsCtrl', function($scope, FormsSvc) {
  
  $scope.user = FormsSvc.getUser()

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    $scope.current_habit = $scope.user.current_habit // set to the current user's habit
  }

  $scope.week = FormsSvc.getCurrentWeek() // set to the current week

  $scope.addForm = function() {
      FormsSvc.createForm({
        user: $scope.user.name,
        category: $scope.user.current_habit.category,
        habit: $scope.current_habit.description,
        timesperweek: $scope.current_habit.timesperweek,
        week: $scope.week      
      }).success(function (form) {
        $scope.user = null
        $scope.category = null
        $scope.habit = null
        $scope.week = null  
      })
  }
  $scope.addHabit = function() {
      FormsSvc.createHabit({
        user: $scope.user.name,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek,
        week: $scope.week      
      }).success(function (habit) {
        $scope.habit = habit
        $scope.category = habit.category
        $scope.week = habit.week
      })
  }
})