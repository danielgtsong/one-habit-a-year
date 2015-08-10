angular.module('app', ['ngRoute'])
angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  $scope.users = []
  $scope.teams = []
  $scope.members = []

  AdminSvc.fetchUsers().success(function (users) {
    $scope.users = users
  })
  AdminSvc.fetchTeams().success(function (teams) {
    $scope.teams = teams
  })

  $scope.addMember = function(username) { // inefficient function
    var i = 0
    var found = false
    var member = {}
    do {
        if ($scope.users[i].username == username) {
          member = $scope.users[i]
          found = true
        }
        i++;
    }
    while (i < $scope.users.length && !found);
  	
    // console.log('[admin.ctrl.js] $scope.users: ' + JSON.stringify($scope.users))
    // console.log('[admin.ctrl.js] member: ' + JSON.stringify(member))
    $scope.members.unshift(member)
  }

  $scope.removeMember = function(member) {
    for (var i = 0; i < $scope.members.length; i++ ) {
      if ($scope.members[i] == member) {
        $scope.members.splice(i, 1);
        return;
      }
    }
  }
  
  $scope.addTeam = function() {
    if ($scope.team_name && $scope.year && $scope.group_number && $scope.category && $scope.members) {
      // $http.post('/api/posts', {
      AdminSvc.createTeam({
        team_name: $scope.team_name,
        year: $scope.year,
        group_number: $scope.group_number,
        category: $scope.category,
        members: $scope.members
      }).success(function (team) {
        $scope.teams.unshift(team)
        $scope.team_name = null
        $scope.year = null
        $scope.group_number = null
        $scope.category = null
        $scope.members = null
      })
    }
  }

  // $scope.login = function(username, password) {
  //   AdminSvc.login(username, password)
  //   .then(function (response) {
  //     $scope.$emit('login', response.data)
  //   })
  // }
})
angular.module('app').service('AdminSvc', function($http) {
  
  var svc = this

  this.fetchUsers = function() { // returns alll users
    return $http.get('/api/admin')
  }
  this.fetchTeams = function() { // returns alll teams
    return $http.get('/api/admin/teams')
  }
  this.createTeam = function (team) {
    return $http.post('/api/teams', team)
  }

})
angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc) {
  $scope.$on('login', function(_, user) {
  	console.log('[application.ctrl.js] currentUser set')
    $scope.currentUser = user
    FormsSvc.setUser(user)
  })
})

angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc) {
  
  $scope.user = FormsSvc.getUser()

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    $scope.habit = $scope.user.current_habit // set to the current user's habit
  }

  $scope.week = FormsSvc.getCurrentWeek() // set to the current week
  console.log('forms.ctrl.js - $scope.habit', $scope.habit)

  $scope.addHabit = function() {
      FormsSvc.createHabit({
        user: $scope.user,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek,
      }).success(function (habit) {
        $scope.habit = habit
        $scope.category = habit.category
        // $scope.user.setCurrentHabit(habit) // doesnt work
        // $scope.user.set('current_habit', habit) // doesnt work

        // $scope.user.current_habit = habit // doesnt really work
        // $scope.user.setHabit(habit) // doesnt work
        // $scope.user.save() // doesnt work
        UserSvc.setHabit($scope.user, habit)
      })
  }

  $scope.addForm = function() {
      FormsSvc.createForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: $scope.week      
      }).success(function (form) {
        $scope.user = null
        $scope.category = null
        $scope.habit = null
        $scope.week = null  
      })
  }
})
angular.module('app').service('FormsSvc', function($http) {

  this.user = {}
  this.setUser = function(user) {
  	// console.log('[FormsSvc] user set: ' + JSON.stringify(user))
  	this.user = user
  }
  this.getUser = function() {
  	return this.user
  }
  this.createForm = function (post) {
    return $http.post('/api/forms', post)
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week')
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }
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
  .when('/forms', { controller: 'FormsCtrl', templateUrl: 'forms.html' })
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
  svc.setHabit = function(user, current_habit) {
    return $http.post('/api/users/sethabit', {
      user: user,
      current_habit: current_habit
    })
  }
})

// User's enter email, password, phone number, GLDI class, city, state, country, photo.