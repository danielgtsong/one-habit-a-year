angular.module('app').service('FormsSvc', function($http) {

  var self = this;

  /// DEVELOPMENT
  this.updateWeekOfForm = function(update_obj) {
    return $http.post('/api/weeks/update', update_obj).then(function(response) {
      return { data: response.data }
    })
  }

  this.getWeek = function(week_id) {
    return $http.post('/api/weeks/findOne', { week_id: week_id }).then(function(response) {
      return { data: response.data }
    })
  }
  this.getUserForm = function(form_id) {
    return $http.post('/api/forms/findOne', { form_id: form_id }).then(function(response) {
      return { data: response.data }
    })
  }

  /// DONE
  this.user = {}
  this.setUser = function(user) {
    // console.log('FormsSvc setUser: ', user)
  	this.user = user
  }
  this.getUser = function() {
    // console.log('FormsSvc getUser: ', this.user)
  	return this.user
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
    return $http.post('/api/forms', form).then(function(response) {
      return { form: response.form,
               current_week_of_user: response.current_week_of_user
             }
    })
  }
})