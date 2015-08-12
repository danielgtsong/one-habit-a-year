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
angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc) {
  if(window.localStorage.token) {
  	// console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
  	var token = window.localStorage.token

  	// var user = UserSvc.getUser(token)
  	// console.log('application ctrl - user ', user)
  	// $scope.currentUser = user

  	// var user = UserSvc.loginWithToken(token)
  	$scope.user = LoginSvc.loginWithToken(token).then(function(response) {
      $scope.user_data = response.data;
    });
  	
  	setTimeout(function() {
  		// console.log('ApplicationCtrl - user ', $scope.user)
  		// console.log('ApplicationCtrl - user_data ', $scope.user_data)
  		$scope.currentUser = $scope.user_data
  		FormsSvc.setUser($scope.user_data)
  	},50)
  }

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
    // $scope.habit = $scope.user.current_habit // set to the current user's habit
    // $scope.habit = FormsSvc.getHabit($scope.user.current_habit)
    FormsSvc.getHabit($scope.user.current_habit)

    setTimeout(function(){ 
      $scope.response_obj = FormsSvc.response_obj
      // console.log('hi from forms controller, response_obj: ', $scope.response_obj) 
      $scope.habit = $scope.response_obj.data
      console.log('FormsCtrl  , $scope.habit: ', $scope.habit) 
    }, 100);
  }

  FormsSvc.getCurrentWeek().then(function(response) {
    $scope.week = response.data
  }) // set to the current week
  setTimeout(function(){ 
    // console.log('FormsCtrl, $scope.week: ', $scope.week )
  }, 300);

  $scope.getCategory = function() {
    console.log('getCategory ', $scope.habit.category)
    return $scope.habit.category
  }

  $scope.addHabit = function() {
      FormsSvc.createHabit({
        user: $scope.user,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek,
      }).success(function (habit) {
        $scope.habit = habit
        $scope.category = habit.category
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

  var self = this;
  this.user = {}
  this.setUser = function(user) {
  	// console.log('[FormsSvc] user set: ' + JSON.stringify(user))
  	this.user = user
  }
  this.getUser = function() {
  	return this.user
  }
  this.createForm = function (form) {
    return $http.post('/api/forms', form)
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week').then(function(response) {
      return { data: response.data }
    })
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }

  self.response_obj = {}
  self.getHabit = function(habit) {
    
    // self.response_obj = {}
    $http.post('/api/habits/findOne', { _id: habit })
    .then(function (habit, response_obj) {
        // setTimeout(function(){ console.log('hello from getHabit'); }, 3000);
        // console.log('FormsSvc returned habit: ', habit.data)
        self.response_obj.data = habit.data
        return habit.data
    }) 
    // setTimeout(function(){ console.log('response_obj: ', self.response_obj) }, 3000);
    // console.log('response: ', response.$$state)
    // console.log('response_obj: ', self.response_obj)
    return self.response_obj
  }
})
angular.module('app').controller('LoginCtrl', function($scope, UserSvc) {
  $scope.login = function(username, password) {
    UserSvc.login(username, password)
    .then(function (response) {
      $scope.$emit('login', response.data)
    })
  }

  $scope.emitLogin = function(response) {
  	$scope.$emit('login', response.data)
  }

  $scope.loginWithToken = function(token) {
  	console.log('LoginCtrl - loginWithToken')
    UserSvc.loginWithToken(token)
    .then(function (response) {
      console.log('LoginCtrl - loginWithToken, response: ', response)
      $scope.$emit('login', response.data)
    })
  }
  
})

angular.module('app').service('LoginSvc', function($http, UserSvc) {
  var loginSvc = this
  loginSvc.user = null;
  loginSvc.loginWithToken = function(token) {
    // console.log('LoginSvc - loginWithToken')
    return UserSvc.loginWithToken(token)
    .then(function (response) {
      return { data: response.data }
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