angular.module('app').service('FormsSvc', function($http) {

  var self = this;
  this.user = {}
  this.setUser = function(user) {
    // console.log('FormsSvc setUser: ', user)
  	this.user = user
  }
  this.getUser = function() {
    // console.log('FormsSvc getUser: ', this.user)
  	return this.user
  }
  this.getWeek = function(week_id) {
    return $http.get('/api/weeks/findOne').then(function(response) {
      return { data: response.data }
    })
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week').then(function(response) {
      return { data: response.data }
    })
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }
  self.getHabit = function(habit) {
    return $http.post('/api/habits/findOne', { _id: habit })
    .then(function (habit) {
        return { data: habit.data }
    }) 
  }
  this.createForm = function (form) {
    return $http.post('/api/forms', form)
  }
})