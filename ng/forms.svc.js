angular.module('app').service('FormsSvc', function($http) {
  // this.fetch = function() {
  //   return $http.get('/api/forms')
  // }
  this.create = function (post) {
    return $http.post('/api/forms', post)
  }
  this.getCurrentWeek = function() {
  	return $http.post('/api/forms/current_week', post)
  }
})