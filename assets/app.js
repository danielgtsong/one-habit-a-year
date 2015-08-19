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
angular.module('app').controller('ApplicationCtrl', function($scope, FormsSvc, UserSvc, LoginSvc, ApplicationSvc) {

    $scope.KEEP_ME_LOGGED_IN = true
    // console.log('KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)
    
    // if($scope.KEEP_ME_LOGGED_IN == false) {
    //     console.log('IM LOGGING OUT')
    //     window.localStorage.token = null
    //     ApplicationSvc.removeTokenFromHeaders();
    //     $scope.currentUser = null
    //     console.log('LOGOUT token ', window.localStorage.token)
    //     console.log('LOGOUT USER ', $scope.currentUser)
    // }

    $scope.switchLoginStatus = function() {
        // console.log('switchLoginStatus ')
         $scope.KEEP_ME_LOGGED_IN = false
         // console.log('switchLoginStatus KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)

         // console.log('IM LOGGING OUT')
        window.localStorage.token = null
        ApplicationSvc.removeTokenFromHeaders();
        $scope.currentUser = null
        // console.log('LOGOUT token ', window.localStorage.token)
        // console.log('LOGOUT USER ', $scope.currentUser)
    }

  if($scope.KEEP_ME_LOGGED_IN == true && window.localStorage.token != 'null') {
    // console.log('if KEEP_ME_LOGGED_IN == ', $scope.KEEP_ME_LOGGED_IN)
    // console.log('token is not null ', window.localStorage.token != 'null')
    // console.log('ApplicationCtrl- logging in with token')
    // console.log('ApplicationCtrl- localStorage.token ', window.localStorage.token)
    var token = window.localStorage.token
    var user = UserSvc.getUserWithToken(token)
    .then(function(response) {
        // console.log('[application.ctrl.js] user: ', response.data)
        $scope.$emit('login', response.data)
    });
  }

  $scope.$on('login', function(_, user) {
    $scope.currentUser = user
    FormsSvc.setUser(user)
    setTimeout(function() {
        $scope.KEEP_ME_LOGGED_IN = true
        // console.log('KEEP_ME_LOGGED_IN ', $scope.KEEP_ME_LOGGED_IN)
    }, 100) 
  })

})

angular.module('app').service('ApplicationSvc', function($http) {
  this.removeTokenFromHeaders = function() {
    // console.log('ApplicationSvc removeTokenFromHeaders')
    $http.defaults.headers.common['X-Auth'] = null
    // console.log('ApplicationSvc removeTokenFromHeaders header[X-Auth]: ', $http.defaults.headers.common['X-Auth'])
  }
})
angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
    
  $scope.setUser = function() {
    // console.log('setUser')
    $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
    // console.log('FormsCtrl user ', $scope.user)
  }
  $scope.generateNewCurrentWeek = function() {
    // console.log('generateNewCurrentWeek')
    FormsSvc.getCurrentWeek().then(function(response) { // SET THE CURRENT WEEK
      $scope.current_week = response.data
      // console.log('current_week generated ', $scope.current_week)
      $scope.CURRENT_WEEK_LOADED = true
    })
  }
  $scope.setCurrentAttributeBooleans = function() {
    // console.log('setCurrentAttributeBooleans')
    if($scope.user.current_habit) {
      $scope.USER_HAS_CURRENT_HABIT_ATTRIBUTE = true;
    } else { $scope.USER_HAS_CURRENT_HABIT_ATTRIBUTE = false;}
    if($scope.user.current_week) {
      $scope.USER_HAS_CURRENT_WEEK_ATTRIBUTE = true;
    } else {$scope.USER_HAS_CURRENT_WEEK_ATTRIBUTE = false;}
    if($scope.user.current_week) {
      $scope.USER_HAS_CURRENT_FORM = true;
    } else {$scope.USER_HAS_CURRENT_FORM = false;}
  }
  $scope.getUserCurrentHabit = function() {
    // console.log('getUserCurrentHabit')
    if($scope.USER_HAS_CURRENT_HABIT_ATTRIBUTE) { 
      var habit_id = $scope.user.current_habit
      FormsSvc.getHabit(habit_id).then(function(response) {
        $scope.habit = response.data
      })
    }
  }
  $scope.getUserCurrentWeek = function() {
    // console.log('getUserCurrentWeek')
    if($scope.USER_HAS_CURRENT_WEEK_ATTRIBUTE) {
      // console.log('getUserCurrentWeek USER_HAS_CURRENT_WEEK_ATTRIBUTE, ', $scope.USER_HAS_CURRENT_WEEK_ATTRIBUTE)
      var week_id = $scope.user.current_week
      WeeksSvc.getWeek(week_id).then(function(response) {
        if(!$scope.CURRENT_WEEK_LOADED) {
          setTimeout(function() {
            console.log('we are waiting for current week to load')
          }, 250)
        } 
        $scope.current_week_of_user = response.data
        // console.log('getUserCurrentWeek current_week_of_user, ', $scope.current_week_of_user)
        $scope.CURRENT_WEEK_OF_USER_LOADED = true
        $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
        // console.log('getUserCurrentWeek CURRENT_WEEK_OF_USER_LOADED, ', $scope.CURRENT_WEEK_OF_USER_LOADED)
      })
    } else {
      $scope.setNewUserWeek($scope.current_week); // give the user a new week, if he doesnt have the attribute
    }
  }
  $scope.setNewUserWeek = function(current_week) {
    console.log('setNewUserWeek current_week passed in', current_week)
    UserSvc.setNewUserWeek($scope.user, current_week).then(function(response) {
      $scope.current_week_of_user = response.data
      console.log('setNewUserWeek current_week_of_user, ', $scope.current_week_of_user)
      $scope.CURRENT_WEEK_OF_USER_LOADED = true
      $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
      // console.log('setNewUserWeek CURRENT_WEEK_OF_USER_LOADED, ', $scope.CURRENT_WEEK_OF_USER_LOADED)
    })
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
    if($scope.CURRENT_WEEK_OF_USER_LOADED) {
      // console.log('instantiateDays current_week_of_user, ', $scope.current_week_of_user)
      var current_week_of_user = $scope.current_week_of_user
      $scope.DAYS.sunday_complete = current_week_of_user.checks[0].complete,
      $scope.DAYS.monday_complete = current_week_of_user.checks[1].complete,
      $scope.DAYS.tuesday_complete = current_week_of_user.checks[2].complete,
      $scope.DAYS.wednesday_complete = current_week_of_user.checks[3].complete,
      $scope.DAYS.thursday_complete = current_week_of_user.checks[4].complete,
      $scope.DAYS.friday_complete = current_week_of_user.checks[5].complete,
      $scope.DAYS.saturday_complete = current_week_of_user.checks[6].complete;
    }
  }
  $scope.calculateSuccessRate = function() {
    if($scope.CURRENT_WEEK_OF_USER_LOADED) {
      // console.log('calculateSuccessRate')
      var points = 0;
      var checks = $scope.current_week_of_user.checks;
      var total = $scope.habit.timesperweek;

      for(var day_index = 0; day_index < checks.length; day_index++) {
        if(checks[day_index].complete){
          points++;
        }
      }
      var success_rate = points/total;
      
      if(success_rate >= 1.0) {
        $scope.SUCCESS_RATE = 1.0
        return 1.0;
      } else {
        $scope.SUCCESS_RATE = success_rate
        return $scope.SUCCESS_RATE;
      }
      
    }
  }
  $scope.checkIfUserAttributesAreUpToDate = function() {
    if($scope.CURRENT_WEEK_OF_USER_LOADED) {
      console.log('user week of year ', $scope.current_week_of_user.weekofyear)
      console.log('generated week of year ', $scope.current_week.weekofyear)
      if($scope.current_week_of_user.weekofyear < $scope.current_week.weekofyear) {
        $scope.USER_WEEK_UP_TO_DATE = false;
        $scope.USER_FORM_UP_TO_DATE = false;
      } else {
        $scope.USER_WEEK_UP_TO_DATE = true;
        $scope.USER_FORM_UP_TO_DATE = true; 
      }
      $scope.$emit('UserAttributesDateCheck', true);
    }
  }
  $scope.setCurrentFormOfUser = function() {
    console.log('setCurrentFormOfUser')
    if($scope.USER_FORM_UP_TO_DATE) {
      console.log('user form is UP TO DATE')
      var form_id = $scope.user.current_form
      FormsSvc.getUserForm(form_id).then(function(response) {
        $scope.current_form_of_user = response.data
        // console.log('current_form_of_user ==> , ', response.data)
      })
    } else {
      console.log('user form is OUT OF DATE')
    }
  }

  // **************s*****************************************************
  $scope.setUser();
  $scope.generateNewCurrentWeek(); // generate a new week
  $scope.setCurrentAttributeBooleans();
  $scope.getUserCurrentHabit();
  $scope.getUserCurrentWeek();

  $scope.setDaysAndSuccessRate = function() {
    $scope.instantiateDays();
    $scope.calculateSuccessRate();
  }
  $scope.$on('CURRENT_WEEK_OF_USER_LOADED', function(event, data) { 
    $scope.setDaysAndSuccessRate();
    $scope.checkIfUserAttributesAreUpToDate();
  });
  $scope.$on('UserAttributesDateCheck', function(event, data) { 
    $scope.setCurrentFormOfUser();
  });
  
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

  $scope.updateForm = function() {
    console.log('************updateForm******************')
      FormsSvc.updateWeekOfForm({
        form: $scope.current_form_of_user,
        week: $scope.current_week_of_user      
      }).then(function (response) {
        console.log('************updateForm, a form with updated week: ', response.data)
        $scope.current_week_of_user = response.data
      })
  }

  $scope.addNewForm = function() {
      FormsSvc.createForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: $scope.current_week_of_user      
      }).then(function (response) {
        console.log('AddNewForm response: ', response)
        UserSvc.setNewUserForm($scope.user, response.form)
        $scope.setNewUserWeek(response.current_week_of_user);
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
    return $http.post('/api/forms', form).then(function(response) {
      return { form: response.form,
               current_week_of_user: response.current_week_of_user
             }
    })
  }
})
angular.module('app').controller('HabitsCtrl', function($scope, HabitsSvc, FormsSvc) {
  $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
  $scope.habits = []
  console.log('HabitsCtrl user: ', $scope.user)
  $scope.addHabit = function() {
    if ($scope.user && $scope.category && $scope.description && $scope.timesperweek) {
      // $http.post('/api/posts', {
      HabitsSvc.createNewHabit({
        user: $scope.user,
        category: $scope.category,
        description: $scope.description,
        timesperweek: $scope.timesperweek
      }).success(function (habit) {
        $scope.habits.unshift(habit)
        $scope.username = null
        $scope.category = null
        $scope.description = null
        $scope.timesperweek = null
      })
    }
  }
  // HabitsSvc.fetchAllHabits().success(function (habits) {
  //   $scope.habits = habits
  // })
  HabitsSvc.fetchUserHabits($scope.user).then(function (response) {
    $scope.habits = response.data
  })
})
angular.module('app').service('HabitsSvc', function($http) {
  this.fetchAllHabits = function() {
    return $http.get('/api/habits')
  }
  this.createNewHabit = function (habit) {
    return $http.post('/api/habits', habit)
  }
  this.fetchUserHabits = function (user) {
    return $http.post('/api/habits/user_habits', { user: user })
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
  .when('/', { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/logout', { controller: 'ApplicationCtrl', templateUrl: 'logout.html' })
  .when('/habits', { controller: 'HabitsCtrl', templateUrl: 'habits.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/forms', { controller: 'FormsCtrl', templateUrl: 'forms.html' })
  .when('/admin', { controller: 'AdminCtrl', templateUrl: 'admin.html' })
  .when('/team', { controller: 'AdminCtrl', templateUrl: 'team.html' })
})

angular.module('app').service('UserSvc', function($http) {
  var svc = this

  svc.setNewUserWeek = function(user, current_week) {
    // console.log('UserSvc setNewUserWeek')
    return $http.post('/api/weeks', current_week).then(function(response) {
      return $http.post('/api/users/setweek', {
        user: user,
        current_week: response.data
      }).then(function(response) {
        return { data: response.data }
      })
    })
  }
  svc.setNewUserForm = function(user, current_form) {
    return $http.post('/api/users/setform', {
      user: user,
      current_form: current_form
    })
  }
  svc.getUserWithToken = function(token) {
    $http.defaults.headers.common['X-Auth'] = token
    var user = $http.get('/api/users').then(function(response) {
       return { data: response.data }
    })
    return user
  }
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
angular.module('app').service('WeeksSvc', function($http) {
  this.getWeek = function(week_id) {
    return $http.post('/api/weeks/findOne', { week_id: week_id })
    .then(function(response) {
      // console.log('WeeksSvc getWeek response.data, ', response.data)
      return { data: response.data}
    })
  }
})