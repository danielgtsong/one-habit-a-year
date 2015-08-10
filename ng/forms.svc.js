angular.module('app').service('FormsSvc', function($http) {

  this.user = {}
  this.setUser = function(user) {
  	// console.log('[FormsSvc] user set: ' + JSON.stringify(user))
  	this.user = user
  }
  this.getUser = function() {
  	return this.user
  }
  this.createForm = function (post) {
    return $http.post('/api/forms', post)
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week')
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }
})