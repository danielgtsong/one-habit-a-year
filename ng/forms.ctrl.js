angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
    
  $scope.setUser = function() {
    console.log('setUser')
    $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
    // console.log('FormsCtrl user ', $scope.user)
  }
  $scope.generateNewCurrentWeek = function() {
    console.log('generateNewCurrentWeek')
    FormsSvc.getCurrentWeek().then(function(response) { // SET THE CURRENT WEEK
      $scope.current_week = response.data
      // console.log('current_week generated ', $scope.current_week)
      $scope.CURRENT_WEEK_LOADED = true
    })
  }
  $scope.setCurrentAttributeBooleans = function() {
    console.log('setCurrentAttributeBooleans')
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
    console.log('getUserCurrentHabit')
    if($scope.USER_HAS_CURRENT_HABIT_ATTRIBUTE) { 
      var habit_id = $scope.user.current_habit
      FormsSvc.getHabit(habit_id).then(function(response) {
        $scope.habit = response.data
      })
    }
  }
  $scope.getUserCurrentWeek = function() {
    console.log('getUserCurrentWeek')
    if($scope.USER_HAS_CURRENT_WEEK_ATTRIBUTE) {
      var week_id = $scope.user.current_week
      WeeksSvc.getWeek(week_id).then(function(response) {
        if(!$scope.CURRENT_WEEK_LOADED) {
          setTimeout(function() {
            console.log('we are waiting for current week to load')
          }, 250)
        } 
        $scope.current_week_of_user = response.data
        $scope.CURRENT_WEEK_OF_USER_LOADED = true
      })
    } else {
      $scope.setNewUserWeek();
    }
  }
  $scope.setNewUserWeek = function() {
    console.log('setNewUserWeek')
    // console.log('setNewUserWeek current_week', $scope.current_week)
    // console.log('setNewUserWeek user', $scope.user)
    UserSvc.setNewUserWeek($scope.user, $scope.current_week).then(function(response) {
      $scope.current_week_of_user = response.data
      // console.log('*******current_week_of_user, ', $scope.current_week_of_user)
      $scope.CURRENT_WEEK_OF_USER_LOADED = true
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
    console.log('instantiateDays')
    var current_week_of_user = $scope.current_week_of_user
    $scope.DAYS.sunday_complete = current_week_of_user.checks[0].complete,
    $scope.DAYS.monday_complete = current_week_of_user.checks[1].complete,
    $scope.DAYS.tuesday_complete = current_week_of_user.checks[2].complete,
    $scope.DAYS.wednesday_complete = current_week_of_user.checks[3].complete,
    $scope.DAYS.thursday_complete = current_week_of_user.checks[4].complete,
    $scope.DAYS.friday_complete = current_week_of_user.checks[5].complete,
    $scope.DAYS.saturday_complete = current_week_of_user.checks[6].complete;
  }
  $scope.calculateSuccessRate = function() {
    console.log('calculateSuccessRate')
    var points = 0;
    var checks = $scope.current_week_of_user.checks;
    var total = $scope.habit.timesperweek;

    for(var day_index = 0; day_index < checks.length; day_index++) {
      if(checks[day_index].complete){
        points++;
      }
    }
    $scope.SUCCESS_RATE = points/total
    return $scope.SUCCESS_RATE
  }
  $scope.setCurrentFormOfUser = function() {
    console.log('setCurrentFormOfUser')
    if($scope.USER_FORM_UP_TO_DATE) {
      // console.log('user form is UP TO DATE')
      var form_id = $scope.user.current_form
      FormsSvc.getUserForm(form_id).then(function(response) {
        $scope.current_form_of_user = response.data
        // console.log('current_form_of_user ==> , ', response.data)
      })
    }
  }

  // **************s*****************************************************
  $scope.setUser();
  $scope.generateNewCurrentWeek(); // generate a new week
  $scope.setCurrentAttributeBooleans();
  $scope.getUserCurrentHabit();
  $scope.getUserCurrentWeek();

  $scope.instantiateDays();
  $scope.calculateSuccessRate();
  $scope.setCurrentFormOfUser();

  
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
      FormsSvc.updateWeekOfForm({
        form: $scope.current_form_of_user,
        week: $scope.current_week_of_user      
      }).then(function (response) {
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
    // $scope.checkIfUserAttributesAreUpToDate = function() {
  //   console.log('user week of year ', $scope.current_week_of_user.weekofyear)
  //   console.log('generated week of year ', $scope.current_week.weekofyear)
  //   if($scope.current_week_of_user.weekofyear < $scope.current_week.weekofyear) {
  //     $scope.USER_WEEK_UP_TO_DATE = false;
  //     $scope.USER_FORM_UP_TO_DATE = false;
  //   } else {
  //     $scope.USER_WEEK_UP_TO_DATE = true;
  //     $scope.USER_FORM_UP_TO_DATE = true; 
  //   }
  // }
})