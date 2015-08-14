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
        // console.log('NO SET TIMEOUT')
        $scope.current_week_of_user = response.data
        $scope.CURRENT_WEEK_OF_USER_LOADED = true
        $scope.instantiateDays();
        $scope.calculateSuccessRate();
        // console.log('user week of year ', $scope.current_week_of_user.weekofyear)
        // console.log('generated week of year ', $scope.current_week.weekofyear)
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
            // console.log('SET TIMEOUT')
            $scope.current_week_of_user = response.data
            $scope.CURRENT_WEEK_OF_USER_LOADED = true
            $scope.instantiateDays();
            $scope.calculateSuccessRate();
            // console.log('user week of year ', $scope.current_week_of_user.weekofyear)
            // console.log('generated week of year ', $scope.current_week.weekofyear)
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
      // console.log('user week is UP TO DATE')
    } else {
      if(!$scope.USER_HAS_CURRENT_WEEK) {
        // console.log('user has no current week attribute')
      }
      // console.log('USER_WEEK_UP_TO_DATE: ', $scope.USER_WEEK_UP_TO_DATE)
      // console.log('user week is OUT OF DATE')
      setTimeout(function() {
        UserSvc.setNewWeek($scope.user, $scope.current_week).then(function(response) {
          $scope.current_week_of_user = response.data
          // console.log('*******current_week_of_user, ', $scope.current_week_of_user)
          $scope.CURRENT_WEEK_OF_USER_LOADED = true
          $scope.instantiateDays();
          $scope.calculateSuccessRate();
        })
      }, 500)
    }
  }

  $scope.setCurrentFormOfUser = function() {
    if($scope.USER_FORM_UP_TO_DATE) {
      // console.log('user form is UP TO DATE')
      var form_id = $scope.user.current_form
      FormsSvc.getUserForm(form_id).then(function(response) {
        $scope.current_form_of_user = response.data
        // console.log('current_form_of_user ==> , ', response.data)
      })
    } else {
        if(!$scope.USER_HAS_CURRENT_FORM) {
          // console.log('user has no current FORM attribute')
        }
        // console.log('USER_FORM_UP_TO_DATE: ', $scope.USER_FORM_UP_TO_DATE)
        // console.log('user form is OUT OF DATE')
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

  $scope.calculateSuccessRate = function() {
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