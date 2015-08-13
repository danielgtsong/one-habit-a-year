angular.module('app').service('WeeksSvc', function($http) {
  this.getWeek = function(week_id) {
    return $http.post('/api/weeks/findOne', { week_id: week_id })
    .then(function(response) {
      // console.log('WeeksSvc getWeek response.data, ', response.data)
      return { data: response.data}
    })
  }
})