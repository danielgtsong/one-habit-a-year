angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc) {
  
  $scope.user = FormsSvc.getUser()

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    $scope.current_habit = $scope.user.current_habit // set to the current user's habit
  }

  $scope.week = FormsSvc.getCurrentWeek() // set to the current week

  $scope.addHabit = function() {
      FormsSvc.createHabit({
        user: $scope.user,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek,
      }).success(function (habit) {
        $scope.habit = habit
        $scope.category = habit.category
        // $scope.user.setCurrentHabit(habit) // doesnt work
        // $scope.user.set('current_habit', habit) // doesnt work

        // $scope.user.current_habit = habit // doesnt really work
        // $scope.user.setHabit(habit) // doesnt work
        // $scope.user.save() // doesnt work
        UserSvc.setHabit($scope.user, habit)
      })
  }

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
})