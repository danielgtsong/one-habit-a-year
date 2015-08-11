angular.module('app').service('FormsSvc', function($http) {
  this.stored_habit = 'blank'
  this.user = {}
  this.setUser = function(user) {
  	// console.log('[FormsSvc] user set: ' + JSON.stringify(user))
  	this.user = user
  }
  this.getUser = function() {
  	return this.user
  }
  this.createForm = function (form) {
    return $http.post('/api/forms', form)
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week')
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }
  this.getHabit = function(habit) {
    console.log('FormsSvc - getHabit', habit)
    $http.post('/api/habits/findOne', { _id: habit })
    .then(function (habit) {
        console.log('FormsSvc returned habit: ', habit.data)
        $http.post('/api/habits/stored_habit', { habit: habit.data })
        this.stored_habit = habit.data
        console.log('FormsSvc this.stored_habit: ', this.stored_habit)
    }) 
  }
  this.getStoredHabit = function() {
    console.log('getStoredHabit: ', this.stored_habit)
    return this.stored_habit
  }
})