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
    
  $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
  FormsSvc.getCurrentWeek().then(function(response) { // SET THE CURRENT WEEK
    $scope.current_week = response.data
    $scope.CURRENT_WEEK_LOADED = true
  })

  // SET UP YOUR BOOLEANS ************************************
  if($scope.user.current_habit) {
    $scope.USER_HAS_CURRENT_HABIT = true;
  } else { $scope.USER_HAS_CURRENT_HABIT = false;}
  if($scope.user.current_week) {
    $scope.USER_HAS_CURRENT_WEEK = true;
  } else {$scope.USER_HAS_CURRENT_WEEK = false;}
  if($scope.user.current_week) {
    $scope.USER_HAS_CURRENT_FORM = true;
  } else {$scope.USER_HAS_CURRENT_FORM = false;}
  // SET UP YOUR BOOLEANS ************************************
  
  if($scope.USER_HAS_CURRENT_HABIT) { // RETRIEVE THE CURRENT HABITS
    var habit_id = $scope.user.current_habit
    FormsSvc.getHabit(habit_id).then(function(response) {
      $scope.habit = response.data
    })
  }

  if($scope.USER_HAS_CURRENT_WEEK) {
    var week_id = $scope.user.current_week
    WeeksSvc.getWeek(week_id).then(function(response) {
      if($scope.CURRENT_WEEK_LOADED) {
        console.log('NO SET TIMEOUT')
        $scope.current_week_of_user = response.data
        $scope.CURRENT_WEEK_OF_USER_LOADED = true
        $scope.instantiateDays();
        console.log('user week of year ', $scope.current_week_of_user.weekofyear)
        console.log('generated week of year ', $scope.current_week.weekofyear)
        if($scope.current_week_of_user.weekofyear < $scope.current_week.weekofyear) {
          $scope.USER_WEEK_UP_TO_DATE = false;
          $scope.USER_FORM_UP_TO_DATE = false;
        } else {
          $scope.USER_WEEK_UP_TO_DATE = true;
          $scope.USER_FORM_UP_TO_DATE = true; 
        }
      }
      else if(!$scope.CURRENT_WEEK_LOADED) {
        setTimeout(function() {
            console.log('SET TIMEOUT')
            $scope.current_week_of_user = response.data
            $scope.CURRENT_WEEK_OF_USER_LOADED = true
            $scope.instantiateDays();
            console.log('user week of year ', $scope.current_week_of_user.weekofyear)
            console.log('generated week of year ', $scope.current_week.weekofyear)
            if($scope.current_week_of_user.weekofyear < $scope.current_week.weekofyear) {
              $scope.USER_WEEK_UP_TO_DATE = false;
              $scope.USER_FORM_UP_TO_DATE = false;
            } else {
              $scope.USER_WEEK_UP_TO_DATE = true;
              $scope.USER_FORM_UP_TO_DATE = true;
            }
        }, 250)
      }
      // console.log('USER_WEEK_UP_TO_DATE: ', $scope.USER_WEEK_UP_TO_DATE)
      // console.log('USER_FORM_UP_TO_DATE: ', $scope.USER_FORM_UP_TO_DATE)
      $scope.setNewUserWeek();
      $scope.setCurrentFormOfUser();
    })
  }

  $scope.setNewUserWeek = function() {
    if($scope.USER_WEEK_UP_TO_DATE) { // week is up to date
      console.log('user week is UP TO DATE')
    } else {
      if(!$scope.USER_HAS_CURRENT_WEEK) {
        console.log('user has no current week attribute')
      }
      console.log('USER_WEEK_UP_TO_DATE: ', $scope.USER_WEEK_UP_TO_DATE)
      console.log('user week is OUT OF DATE')
      setTimeout(function() {
        UserSvc.setNewWeek($scope.user, $scope.current_week).then(function(response) {
          $scope.current_week_of_user = response.data
          console.log('*******current_week_of_user, ', $scope.current_week_of_user)
          $scope.CURRENT_WEEK_OF_USER_LOADED = true
        })
      }, 500)
    }
  }

  $scope.setCurrentFormOfUser = function() {
    if($scope.USER_FORM_UP_TO_DATE) {
      console.log('user form is UP TO DATE')
      var form_id = $scope.user.current_form
      FormsSvc.getUserForm(form_id).then(function(response) {
        $scope.current_form_of_user = response.data
        console.log('current_form_of_user ==> , ', response.data)
      })
    } else {
        if(!$scope.USER_HAS_CURRENT_FORM) {
          console.log('user has no current FORM attribute')
        }
        console.log('USER_FORM_UP_TO_DATE: ', $scope.USER_FORM_UP_TO_DATE)
        console.log('user form is OUT OF DATE')
        $scope.current_form_of_user = null
    } 
  }

  $scope.DAYS = {
      sunday_complete: false,
      monday_complete: false,
      tuesday_complete: false,
      wednesday_complete: false,
      thursday_complete: false,
      friday_complete: false,
      saturday_complete: false
  }
  $scope.instantiateDays = function() {
    var current_week_of_user = $scope.current_week_of_user
    $scope.DAYS.sunday_complete = current_week_of_user.checks[0].complete,
    $scope.DAYS.monday_complete = current_week_of_user.checks[1].complete,
    $scope.DAYS.tuesday_complete = current_week_of_user.checks[2].complete,
    $scope.DAYS.wednesday_complete = current_week_of_user.checks[3].complete,
    $scope.DAYS.thursday_complete = current_week_of_user.checks[4].complete,
    $scope.DAYS.friday_complete = current_week_of_user.checks[5].complete,
    $scope.DAYS.saturday_complete = current_week_of_user.checks[6].complete;
  }
  
  $scope.switchDayComplete = function(day_index) {
    $scope.current_week_of_user.checks[day_index].complete = !($scope.current_week_of_user.checks[day_index].complete)
    switch(day_index) {
      case 0:
        $scope.DAYS.sunday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 1:
        $scope.DAYS.monday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 2:
        $scope.DAYS.tuesday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 3:
        $scope.DAYS.wednesday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 4:
        $scope.DAYS.thursday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 5:
        $scope.DAYS.friday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
      case 6:
        $scope.DAYS.saturday_complete = $scope.current_week_of_user.checks[day_index].complete
        break;
    }
  }

  $scope.myVar = 'checked'
  $scope.applyDisabled = function(complete_day) {
    if (complete_day) {
        return "disabled";
    } else {
        return ""
    }
  }

  $scope.updateForm = function() {
      FormsSvc.updateWeekOfForm({
        form: $scope.current_form_of_user,
        week: $scope.current_week_of_user      
      }).then(function (response) {
        // UserSvc.setForm($scope.user, form), not necessary because form id is the same
        console.log('updateForm, a form with updated week: ', response.data)
      })
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

  /// DEVELOPMENT
  this.updateWeekOfForm = function(update_obj) {
    return $http.post('/api/weeks/update', update_obj).then(function(response) {
      return { data: response.data }
    })
  }

  this.getWeek = function(week_id) {
    return $http.post('/api/weeks/findOne', { week_id: week_id }).then(function(response) {
      return { data: response.data }
    })
  }
  this.getUserForm = function(form_id) {
    return $http.post('/api/forms/findOne', { form_id: form_id }).then(function(response) {
      return { data: response.data }
    })
  }

  /// DONE
  this.user = {}
  this.setUser = function(user) {
    // console.log('FormsSvc setUser: ', user)
  	this.user = user
  }
  this.getUser = function() {
    // console.log('FormsSvc getUser: ', this.user)
  	return this.user
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

  svc.setNewWeek = function(user, current_week) {
    // console.log('UserSvc - current_week, ', current_week)
    return $http.post('/api/weeks', current_week).then(function(response) {
      // console.log('UserSvc - setWeek response.data, ', response.data)
      return $http.post('/api/users/setweek', {
        user: user,
        current_week: response.data
      }).then(function(response) {
        return { data: response.data }
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