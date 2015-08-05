angular.module('app', ['ngRoute'])
angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  $scope.users = []
  AdminSvc.fetch().success(function (users) {
    $scope.users = users
  })
})
angular.module('app').service('AdminSvc', function($http) {
  this.fetch = function() {
    return $http.get('/admin')
  }
  // this.create = function (admin) {
  //   return $http.post('/api/admin', post)
  // }
})
angular.module('app').controller('ApplicationCtrl', function($scope) {
  $scope.$on('login', function(_, user) {
    $scope.currentUser = user
  })
})

angular.module('app').controller('FormCtrl', function($scope, PostsSvc) {
  $scope.posts = []
  $scope.addPost = function() {
    if ($scope.username && $scope.category && $scope.habit && $scope.timesperweek) {
      // $http.post('/api/posts', {
      PostsSvc.create({
        username: $scope.username,
        category: $scope.category,
        habit: $scope.habit,
        timesperweek: $scope.timesperweek
      }).success(function (post) {
        $scope.posts.unshift(post)
        $scope.username = null
        $scope.category = null
        $scope.habit = null
        $scope.timesperweek = null
      })
    }
  }
  PostsSvc.fetch().success(function (posts) {
    $scope.posts = posts
  })
})
angular.module('app').controller('LoginCtrl', function($scope, UserSvc) {
  $scope.login = function(username, password) {
    UserSvc.login(username, password)
    .then(function (response) {
      $scope.$emit('login', response.data)
    })
  }
})

angular.module('app').controller('PostsCtrl', function($scope, PostsSvc) {
  $scope.posts = []
  $scope.addPost = function() {
    if ($scope.username && $scope.category && $scope.habit && $scope.timesperweek) {
      // $http.post('/api/posts', {
      PostsSvc.create({
        username: $scope.username,
        category: $scope.category,
        habit: $scope.habit,
        timesperweek: $scope.timesperweek
      }).success(function (post) {
        $scope.posts.unshift(post)
        $scope.username = null
        $scope.category = null
        $scope.habit = null
        $scope.timesperweek = null
      })
    }
  }
  PostsSvc.fetch().success(function (posts) {
    $scope.posts = posts
  })
})
angular.module('app').service('PostsSvc', function($http) {
  this.fetch = function() {
    return $http.get('/api/posts')
  }
  this.create = function (post) {
    return $http.post('/api/posts', post)
  }
})
angular.module('app').controller('RegisterCtrl', function($scope, UserSvc) {
  $scope.user = {}
  $scope.register = function(user) {
    UserSvc.createUser(user)
    .then(function (response) {
      $scope.$emit('login', response.data)
    })
	console.log('User: ' + JSON.stringify(user))
  }
})
angular.module('app').config(function ($routeProvider) {
  // $locationProvider.html5Mode(true)
  $routeProvider
  .when('/', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/form', { controller: 'FormCtrl', templateUrl: 'form.html' })
  .when('/admin', { controller: 'AdminCtrl', templateUrl: 'admin.html' })
  .when('/team', { controller: 'AdminCtrl', templateUrl: 'team.html' })
})

angular.module('app').service('UserSvc', function($http) {
  var svc = this
  svc.getUser = function() {
    return $http.get('/api/users')
  }
  svc.login = function (username, password) {
    return $http.post('/api/sessions', {
      username: username, password: password
    }).then(function (val) {
      svc.token = val.data
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
})

// User's enter email, password, phone number, GLDI class, city, state, country, photo.