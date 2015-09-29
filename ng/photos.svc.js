angular.module('app').service('PhotosSvc', function($http) {
  // this.fetchAllHabits = function() {
  //   return $http.get('/api/habits')
  // }
  // this.createHabit = function(habit) {
  //   return $http.post('/api/habits', habit)
  // }

  this.createImage = function(photo) {
  	console.log('createImage photo: ', photo);
    // debugger;
  	return $http.post('/api/photos/upload_repository', photo)
  			.then(function(response) {
  				var data = response.data;
  				console.log('createImage data: ', data);
  				return { data: data };
  			})

  }
  this.storeImage = function(files) {
    console.log('storeImage files: ', files);
    return $http.post('/api/photos/upload', files)
        .then(function(response) {
          var data = response.data;
          console.log('createImage data: ', data);
          return { data: data };
        })

  }


})