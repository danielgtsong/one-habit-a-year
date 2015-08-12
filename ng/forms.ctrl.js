angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc) {
  
  $scope.user = FormsSvc.getUser()

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    // $scope.habit = $scope.user.current_habit // set to the current user's habit
    // $scope.habit = FormsSvc.getHabit($scope.user.current_habit)
    FormsSvc.getHabit($scope.user.current_habit)

    setTimeout(function(){ 
      $scope.response_obj = FormsSvc.response_obj
      // console.log('hi from forms controller, response_obj: ', $scope.response_obj) 
      $scope.habit = $scope.response_obj.data
      console.log('FormsCtrl  , $scope.habit: ', $scope.habit) 
    }, 100);
  }

  FormsSvc.getCurrentWeek().then(function(response) {
    $scope.week = response.data
  }) // set to the current week
  setTimeout(function(){ 
    // console.log('FormsCtrl, $scope.week: ', $scope.week )
  }, 300);

  $scope.getCategory = function() {
    console.log('getCategory ', $scope.habit.category)
    return $scope.habit.category
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