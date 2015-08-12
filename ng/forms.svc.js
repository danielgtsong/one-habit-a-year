angular.module('app').service('FormsSvc', function($http) {

  var self = this;
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
  	return $http.get('/api/forms/current_week').then(function(response) {
      return { data: response.data }
    })
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }

  self.response_obj = {}
  self.getHabit = function(habit) {
    
    // self.response_obj = {}
    $http.post('/api/habits/findOne', { _id: habit })
    .then(function (habit, response_obj) {
        // setTimeout(function(){ console.log('hello from getHabit'); }, 3000);
        // console.log('FormsSvc returned habit: ', habit.data)
        self.response_obj.data = habit.data
        return habit.data
    }) 
    // setTimeout(function(){ console.log('response_obj: ', self.response_obj) }, 3000);
    // console.log('response: ', response.$$state)
    // console.log('response_obj: ', self.response_obj)
    return self.response_obj
  }
})