angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc) {
  
  $scope.user = FormsSvc.getUser()

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    // $scope.habit = $scope.user.current_habit // set to the current user's habit
    FormsSvc.getHabit($scope.user.current_habit)
    setTimeout(function() {
      console.log('Times up')
      $scope.habit = FormsSvc.stored_habit;
      console.log('\n[forms.ctrl.js] - stored_habit', FormsSvc.stored_habit)
    }, 5000);
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
        UserSvc.setHabit($scope.user, habit)
      })
  }

  $scope.addForm = function() {
      FormsSvc.createForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: $scope.week      
      }).success(function (form) {
        $scope.user = null
        $scope.category = null
        $scope.habit = null
        $scope.week = null  
      })
  }
})