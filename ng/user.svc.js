angular.module('app').service('UserSvc', function($http) {
  var svc = this
  svc.getUser = function() {
    return $http.get('/api/users')
  }

// ***************************************************************
  svc.loginWithToken = function (token) {
    // console.log('UserSvc - loginWithToken')
    var user = svc.getUserWithToken(token)
    // console.log('UserSvc - loginWithToken, user: ', user)
    return user
  }
  svc.getUserWithToken = function(token) {
    // console.log('UserSvc - getUserWithToken')
    $http.defaults.headers.common['X-Auth'] = token
    var user = $http.get('/api/users')
    // console.log('UserSvc - getUserWithToken, user: ', user)
    return user
  }
// ***************************************************************

  svc.login = function (username, password) {
    return $http.post('/api/sessions', {
      username: username, password: password
    }).then(function (val) {
      svc.token = val.data
      window.localStorage.token = val.data
      $http.defaults.headers.common['X-Auth'] = val.data
      return svc.getUser()
    })
  }
  svc.createUser = function(user) {
    // create user
    return $http.post('/api/users', {
      username: user.username, password: user.password, 
      name: user.name, email: user.email,
      phone: user.phone, year: user.year,
      city: user.city, state: user.state, country: user.country
    }).then(function () {
      return svc.login(user.username, user.password)
    })
    // redirect to login page
  }
  svc.setHabit = function(user, current_habit) {
    return $http.post('/api/users/sethabit', {
      user: user,
      current_habit: current_habit
    })
  }
})

// User's enter email, password, phone number, GLDI class, city, state, country, photo.