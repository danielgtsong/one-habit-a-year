angular.module('app').controller('FormsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
    
  $scope.setUser = function() {
    // console.log('setUser')
    $scope.user = FormsSvc.getUser() // RETRIEVE THE USER
    // console.log('FormsCtrl user ', $scope.user)
  }
  $scope.generateNewCurrentWeek = function() {
    // console.log('generateNewCurrentWeek')
    FormsSvc.getNewGeneratedWeek().then(function(response) { // SET THE CURRENT WEEK
      $scope.generated_week = response.data
      console.log('current_week generated ', $scope.generated_week)
      $scope.GENERATED_WEEK_LOADED = true
      $scope.$emit('GENERATED_WEEK_LOADED', true);
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
        if(!$scope.GENERATED_WEEK_LOADED) {
          setTimeout(function() {
            console.log('we are waiting for current week to load')
          }, 250)
        } 
        $scope.current_week_of_user = response.data
        // console.log('getUserCurrentWeek current_week_of_user, ', $scope.current_week_of_user)
        $scope.current_week_of_user_LOADED = true
        $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
        // console.log('getUserCurrentWeek CURRENT_WEEK_OF_USER_LOADED, ', $scope.current_week_of_user_LOADED)
      })
    } else {
      $scope.setNewUserWeek($scope.generated_week); // give the user a new week, if he doesnt have the attribute
    }
  }
  $scope.setNewUserWeek = function(current_week) {
    console.log('setNewUserWeek current_week passed in', current_week)
    UserSvc.setNewUserWeek($scope.user, current_week).then(function(response) {
      $scope.current_week_of_user = response.data
      // console.log('setNewUserWeek response.data, ', response.data)
      // console.log('setNewUserWeek current_week_of_user, ', $scope.current_week_of_user)
      // console.log('setNewUserWeek current_week_of_user weekofyear, ', $scope.current_week_of_user.weekofyear)
      $scope.current_week_of_user_LOADED = true
      $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
      // console.log('setNewUserWeek CURRENT_WEEK_OF_USER_LOADED, ', $scope.current_week_of_user_LOADED)
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
    if($scope.current_week_of_user_LOADED) {
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
    if($scope.current_week_of_user_LOADED) {
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
    if($scope.current_week_of_user_LOADED && $scope.GENERATED_WEEK_LOADED) {
      // console.log('user week of year ', $scope.current_week_of_user.weekofyear)
      // console.log('generated week of year ', $scope.generated_week.weekofyear)
      if($scope.current_week_of_user.weekofyear < $scope.generated_week.weekofyear) {
        $scope.USER_WEEK_UP_TO_DATE = false;
        $scope.USER_FORM_UP_TO_DATE = false;
      } else {
        $scope.USER_WEEK_UP_TO_DATE = true;
        $scope.USER_FORM_UP_TO_DATE = true; 
      }
      $scope.$emit('USER_ATTRIBUTES_DATE_CHECKED', true);
    }
  }
  $scope.setCurrentFormOfUser = function() {
    // console.log('setCurrentFormOfUser')
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
  $scope.$on('USER_ATTRIBUTES_DATE_CHECKED', function(event, data) { 
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
    // console.log('************updateForm******************')
      FormsSvc.updateWeekOfForm({
        form: $scope.current_form_of_user,
        week: $scope.current_week_of_user      
      }).then(function (response) {
        // console.log('************updateForm, a form with updated week: ', response.data)
        $scope.current_week_of_user = response.data
      })
  }

  var generated_week;
  $scope.$on('GENERATED_WEEK_LOADED', function(event, data) { 
    generated_week = $scope.generated_week;
    // console.log('generated_week: ', generated_week)
  });

  $scope.addNewForm = function() {
      FormsSvc.addNewForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: generated_week  
      }).then(function (response) {
        // console.log('AddNewForm response: ', response)
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