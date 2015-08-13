angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
  
  FormsSvc.getCurrentWeek().then(function(response) {
    $scope.current_week = response.data
    // console.log('FormsCtrl, $scope.current_week: ', $scope.current_week )
  })

  $scope.user = FormsSvc.getUser()
  // console.log('FormsCtrl, $scope.user, ', $scope.user)

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    var habit_id = $scope.user.current_habit
    FormsSvc.getHabit(habit_id).then(function(response) {
      $scope.habit = response.data
      // console.log('FormsCtrl, $scope.habit: ', $scope.habit )
    })
  }

  if(!$scope.user.current_week || $scope.user.current_week < $scope.current_week){
    setTimeout(function() {
      console.log('users has no current week')
      UserSvc.setWeek($scope.user, $scope.current_week)
    }, 500)
  } else { // week is up to date
      console.log('user week is up to date')
      var week_id = $scope.user.current_week
      WeeksSvc.getWeek(week_id).then(function(response) {
        $scope.current_week_of_user = response.data
        console.log('current_week_of_user ==> , ', $scope.current_week_of_user)
      })
  }

  $scope.disabled = 'disabled'
  $scope.class_obj = {
    disabled: true
  }
  $scope.applyDisabledAttribute = function(class_obj) {
    if (class_obj.disabled == true) {
        return "disabled";
    } else {
        return ""
    }
  }

  $scope.addForm = function() {
      FormsSvc.createForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: $scope.current_week_of_user      
      }).success(function (form) {
        UserSvc.setForm($scope.user, form)
        // $scope.user = null
        // $scope.category = null
        // $scope.habit = null
        // $scope.current_week = null 
      })
  }

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
})