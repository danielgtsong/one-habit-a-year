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
  	var user = UserSvc.getUserWithToken(token)
    .then(function(response) {
      // console.log('[application.ctrl.js] response: ', response.data)
      $scope.$emit('login', response.data)
    });
  }

  $scope.$on('login', function(_, user) {
  	// console.log('[application.ctrl.js] currentUser set')
    $scope.currentUser = user
    FormsSvc.setUser(user)
  })
})

angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
  
  FormsSvc.getCurrentWeek().then(function(response) {
    $scope.current_week = response.data
    // console.log('FormsCtrl, $scope.current_week: ', $scope.current_week )
  })

  $scope.user = FormsSvc.getUser()
  // console.log('FormsCtrl, $scope.user, ', $scope.user)

  if(!$scope.user.current_habit) {
    $scope.no_habit = true
  } else {
    var habit_id = $scope.user.current_habit
    FormsSvc.getHabit(habit_id).then(function(response) {
      $scope.habit = response.data
      // console.log('FormsCtrl, $scope.habit: ', $scope.habit )
    })
  }

  if(!$scope.user.current_week || $scope.user.current_week < $scope.current_week){
    setTimeout(function() {
      console.log('users has no current week')
      UserSvc.setWeek($scope.user, $scope.current_week)
    }, 500)
  } else { // week is up to date
      console.log('user week is up to date')
      var week_id = $scope.user.current_week
      WeeksSvc.getWeek(week_id).then(function(response) {
        $scope.current_week_of_user = response.data
        console.log('current_week_of_user ==> , ', $scope.current_week_of_user)
      })
  }

  $scope.disabled = 'disabled'
  $scope.class_obj = {
    disabled: true
  }
  $scope.applyDisabledAttribute = function(class_obj) {
    if (class_obj.disabled == true) {
        return "disabled";
    } else {
        return ""
    }
  }

  $scope.addForm = function() {
      FormsSvc.createForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: $scope.current_week_of_user      
      }).success(function (form) {
        UserSvc.setForm($scope.user, form)
        // $scope.user = null
        // $scope.category = null
        // $scope.habit = null
        // $scope.current_week = null 
      })
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
})
angular.module('app').service('FormsSvc', function($http) {

  var self = this;
  this.user = {}
  this.setUser = function(user) {
    // console.log('FormsSvc setUser: ', user)
  	this.user = user
  }
  this.getUser = function() {
    // console.log('FormsSvc getUser: ', this.user)
  	return this.user
  }
  this.getWeek = function(week_id) {
    return $http.get('/api/weeks/findOne').then(function(response) {
      return { data: response.data }
    })
  }
  this.getCurrentWeek = function() {
  	return $http.get('/api/forms/current_week').then(function(response) {
      return { data: response.data }
    })
  }
  this.createHabit = function(habit) {
  	return $http.post('/api/habits', habit)
  }
  self.getHabit = function(habit) {
    return $http.post('/api/habits/findOne', { _id: habit })
    .then(function (habit) {
        return { data: habit.data }
    }) 
  }
  this.createForm = function (form) {
    return $http.post('/api/forms', form)
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
angular.module('app').service('WeeksSvc', function($http) {
  this.getWeek = function(week_id) {
    return $http.post('/api/weeks/findOne', { week_id: week_id })
    .then(function(response) {
      // console.log('WeeksSvc getWeek response.data, ', response.data)
      return { data: response.data}
    })
  }
})