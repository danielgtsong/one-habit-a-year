angular.module('app').service('ApplicationSvc', function($http) {
  this.removeTokenFromHeaders = function() {
    console.log('ApplicationSvc removeTokenFromHeaders')
    $http.defaults.headers.common['X-Auth'] = null
    console.log('ApplicationSvc remove headers: ', $http.defaults.headers.common['X-Auth'])
  }
})