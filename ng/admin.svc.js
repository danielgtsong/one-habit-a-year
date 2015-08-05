angular.module('app').service('AdminSvc', function($http) {
  this.fetch = function() {
    return $http.get('/admin')
  }
  // this.create = function (admin) {
  //   return $http.post('/api/admin', post)
  // }
})