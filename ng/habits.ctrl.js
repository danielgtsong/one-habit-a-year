angular.module('app').controller('HabitsCtrl', function($scope, HabitsSvc, FormsSvc) {
  $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
  $scope.habits = []
  console.log('HabitsCtrl user: ', $scope.user)
  $scope.addHabit = function() {
    if ($scope.user && $scope.category && $scope.description && $scope.timesperweek) {
      // $http.post('/api/posts', {
      HabitsSvc.createNewHabit({
        user: $scope.user,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek
      }).success(function (habit) {
        $scope.habits.unshift(habit)
        $scope.username = null
        $scope.category = null
        $scope.description = null
        $scope.timesperweek = null
      })
    }
  }
  // HabitsSvc.fetchAllHabits().success(function (habits) {
  //   $scope.habits = habits
  // })
  HabitsSvc.fetchUserHabits($scope.user).then(function (response) {
    $scope.habits = response.data
  })
})