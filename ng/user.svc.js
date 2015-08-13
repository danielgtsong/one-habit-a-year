angular.module('app').service('UserSvc', function($http) {
  var svc = this

  // svc.setWeekTest = function(current_week) {
  //   console.log('UserSvc - setWeekTest current_week: ', current_week)
  //   return $http.post('/api/weeks', current_week)
  // }

  svc.setWeek = function(user, current_week) {
    console.log('UserSvc - current_week, ', current_week)
    $http.post('/api/weeks', current_week).then(function(response) {
      console.log('UserSvc - setWeek response.data, ', response.data)
      $http.post('/api/users/setweek', {
        user: user,
        current_week: response.data
      })
    })
  }
  svc.setForm = function(user, current_form) {
    return $http.post('/api/users/setform', {
      user: user,
      current_form: current_form
    })
  }
// ***************************************************************
  // svc.loginWithToken = function (token) {
  //   console.log('UserSvc - loginWithToken....')
  //   var user = svc.getUserWithToken(token).then(function(response) {
  //     console.log('UserSvc - loginWithToken, response: ', response.data)
  //     return { data: response.data }
  //   })
  //   // console.log('UserSvc - loginWithToken, user: ', user)
  //   return user
  // }
  svc.getUserWithToken = function(token) {
    // console.log('UserSvc - getUserWithToken....')
    $http.defaults.headers.common['X-Auth'] = token
    // console.log('UserSvc - getUserWithToken headers', $http.defaults.headers.common)
    var user = $http.get('/api/users').then(function(response) {
       // console.log('UserSvc - getUserWithToken, response: ', response.data)
       return { data: response.data }
    })
    // console.log('UserSvc - getUserWithToken, user: ', user)
    return user
  }
// ***************************************************************
  svc.getUser = function() {
    return $http.get('/api/users')
  }
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