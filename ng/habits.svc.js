angular.module('app').service('HabitsSvc', function($http) {
  this.fetchAllHabits = function() {
    return $http.get('/api/habits')
  }
  this.createNewHabit = function (habit) {
    return $http.post('/api/habits', habit)
  }
  this.fetchUserHabits = function (user) {
    return $http.post('/api/habits/user_habits', { user: user })
  }
})