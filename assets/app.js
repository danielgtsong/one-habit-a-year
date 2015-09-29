angular.module('app', ['ngRoute', 'ngFileUpload'])
angular.module('app').controller('AdminCtrl', function($scope, AdminSvc) {
  
  AdminSvc.fetchUsers().success(function (users) {
    $scope.users = users
  })
  AdminSvc.fetchTeams().success(function (teams) {
    $scope.teams = teams
  })

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
  }
  $scope.generateNewCurrentWeek = function() {
    // console.log('generateNewCurrentWeek')
    FormsSvc.getNewGeneratedWeek().then(function(response) { // SET THE CURRENT WEEK
      $scope.generated_week = response.data
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
      var week_id = $scope.user.current_week
      WeeksSvc.getWeek(week_id).then(function(response) {
        if(!$scope.GENERATED_WEEK_LOADED) {
          setTimeout(function() {
            console.log('we are waiting for current week to load')
          }, 250)
        } 
        $scope.current_week_of_user = response.data
        $scope.current_week_of_user_LOADED = true
        $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
      })
    } else {
      $scope.setNewUserWeek($scope.generated_week); // give the user a new week if there is no attribute
    }
  }
  $scope.setNewUserWeek = function(current_week) {
    // console.log('setNewUserWeek');
    if(!$scope.GENERATED_WEEK_LOADED) {
      setTimeout(function(){}, 500)
    }
    if($scope.GENERATED_WEEK_LOADED) {
      UserSvc.setNewUserWeek($scope.user, current_week).then(function(response) {
        $scope.current_week_of_user = response.data
        $scope.current_week_of_user_LOADED = true
        $scope.$emit('CURRENT_WEEK_OF_USER_LOADED', true);
      })
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
    // console.log('instantiateDays');
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
    // console.log('checkIfUserAttributesAreUpToDate')
    if($scope.current_week_of_user_LOADED && $scope.GENERATED_WEEK_LOADED) {
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
    // console.log('setDaysAndSuccessRate');
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
    // console.log('switchDayComplete');
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
    // console.log('updateForm')
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
  });

  $scope.addNewForm = function() {
      // console.log('addNewForm')
      FormsSvc.addNewForm({
        user: $scope.user,
        category: $scope.habit.category,
        habit: $scope.habit,
        timesperweek: $scope.habit.timesperweek,
        week: generated_week  
      }).then(function (response) {
        console.log('AddNewForm response.current_week_of_user: ', response.current_week_of_user)
        UserSvc.setNewUserForm($scope.user, response.form)
        $scope.setNewUserWeek(response.current_week_of_user);
      })
  }

  $scope.addHabit = function() {
      // console.log('addHabit');
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
  this.getNewGeneratedWeek = function() {
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
  this.addNewForm = function (form) {
      // console.log('FormsSvc addNewForm form: ', form)
    return $http.post('/api/forms', form).then(function(response) {
      // console.log('FormsSvc addNewForm response: ', response.data)
      return { form: response.data.form,
               current_week_of_user: response.data.current_week_of_user
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
// var mongoose = require('mongoose');
// var db = require('../database')

// // ======================================================================

// var fs = require('fs');
// // var Grid = require('gridfs-stream');
// // Grid.mongo = db.mongo;
// // Grid.mongo = mongoose.mongo;

// // var connection = db.connection;
// // var gfs = Grid(connection.db);
// // var GridFs = require('grid-fs');

// // ======================================================================

// var _ = require('lodash');

// var Grid = require('gridfs-stream');
// // Grid.mongo = db.mongo;
// Grid.mongo = mongoose.mongo;
// var gfs = new Grid(mongoose.connection.db);


angular.module('app').controller('PhotosCtrl', ['$scope', 'Upload', '$timeout', 'PhotosSvc', function ($scope, Upload, $timeout, PhotosSvc) {
     
    // exports.create = function(req, res) {   

    //     var part = req.files.filefield;

    //         var writeStream = gfs.createWriteStream({
    //             filename: part.name,
    //             mode: 'w',
    //             content_type:part.mimetype
    //         });


    //         writeStream.on('close', function() {
    //              return res.status(200).send({
    //                 message: 'Success'
    //             });
    //         });
            
    //         writeStream.write(part.data);

    //         writeStream.end();
    // };
     
     
    // exports.read = function(req, res) {
     
    //     gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
     
    //         if(files.length===0){
    //             return res.status(400).send({
    //                 message: 'File not found'
    //             });
    //         }
        
    //         res.writeHead(200, {'Content-Type': files[0].contentType});
            
    //         var readstream = gfs.createReadStream({
    //               filename: files[0].filename
    //         });
     
    //         readstream.on('data', function(data) {
    //             res.write(data);
    //         });
            
    //         readstream.on('end', function() {
    //             res.end();        
    //         });
     
    //         readstream.on('error', function (err) {
    //           console.log('An error occurred!', err);
    //           throw err;
    //         });
    //     });
     
    // };
    
    $scope.photo;
    $scope.picFile;
    $scope.file;

    // $scope.uploadFiles = function(file) {    // upload on file select
    //     console.log('PhotosCtrl file: ', file);
    //     $scope.photo = file;
    //     if (file && !file.$error) {
    //         file.upload = Upload.upload({
    //             url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //             file: file
    //         });
    //         // url: 'http://localhost:3000/api/photos/storage',
    //         // method: 'POST', 
    //         // //headers: {'header-key': 'header-value'}, 
    //         // data: { img: file }

    //         file.upload.then(function (response) {
    //             $timeout(function () {
    //                 file.result = response.data;
    //             });
    //         }, function (response) {
    //             if (response.status > 0)
    //                 $scope.errorMsg = response.status + ': ' + response.data;
    //         });

    //         file.upload.progress(function (evt) {
    //             file.progress = Math.min(100, parseInt(100.0 * 
    //                                                    evt.loaded / evt.total));
    //         });
    //     }   
    // }

    $scope.files;
    $scope.uploadPic = function(file) { // upload for forms
        // console.log('uploadPic file: ', file)
        file.upload = Upload.upload({
            url: 'http://localhost:3000/api/photos/upload_repository',
            file: file,
            method: 'POST'
            // data: { img: file },
            // fields: {img: file},
            // file: {img: file},
            // sendFieldsAs: json
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
            console.log('uploadPic response.data.files: ', response.data.files)
            // $scope.files = response.data.files
            $scope.$emit('FILES_LOADED', response.data.files);
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        // console.log('uploadPic file: ', file)
    }

    // $scope.registerPhoto = function(file) {
    //   PhotosSvc.createImage({
    //     img: photo
    //   }).then(function (response) {
    //     var data = response.data;
    //     console.log('PhotosCtrl data: ', data);
    //   })
    // }

    $scope.imageAsText;

    // $scope.$on('FILES_LOADED', function(event, data) { 
    //     $scope.files = data;
    //     console.log('FILES_LOADED data: ', data);
    //     $scope.submitPhotoFiles(data);
    // });

    $scope.submitPhotoFiles = function(files) {
      console.log('submitPhotoFiles files: ', files);
      // $scope.parse(file);
      PhotosSvc.storeImage({
        files: files
      }).then(function (response) {
        var data = response.data;
        console.log('PhotosCtrl data: ', data);
      })
    };

    $scope.submitPhoto = function(file) {
      console.log('submitPhoto file: ', file);
      // $scope.parse(file);

      PhotosSvc.createImage({
        img: file
      }).then(function (response) {
        var data = response.data;
        console.log('PhotosCtrl data: ', data);
      })
    };
    
    // $scope.parse = function(file) {
    //     console.log('parse file: ', file);

    //     var fileReader = new FileReader();

    //     fileReader.onload = function (e) {
    //         // console.log('result: ', fileReader.result);
    //         $scope.imageAsText = fileReader.result;
    //         $scope.postImage(fileReader.result);
    //     };

    //     fileReader.onerror = function(err) {
    //         console.log(err);
    //     };
        
    //     // Here you could (should) switch to another read operation
    //     // such as text or binary array
    //     // fileReader.readAsText(file);
    //     fileReader.readAsArrayBuffer(file);
           // fileReader.readAsDataURL(file) // base 64 encoded string
    // }

    // $scope.postImage = function(image) {
    //       console.log('postImage image: ', image);
    //       // debugger;
    //       PhotosSvc.createImage({
    //         img: image
    //       }).then(function (response) {
    //         var data = response.data;
    //         console.log('PhotosCtrl data: ', data);
    //       })
    // }


    // *****************************************************************************

    // $scope.submit = function() {
    //   if (form.file.$valid && $scope.file && !$scope.file.$error) {
    //     $scope.upload($scope.file);
    //   }
    // };

    // // upload on file select or drop
    // $scope.upload = function (file) {
    //     console.log('PhotosCtrl file: ', file);
    //     Upload.upload({
    //         url: 'http://localhost:3000/api/photos/storage',
    //         fields: {img: file},
    //         file: file
    //     }).progress(function (evt) {
    //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //         console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    //     }).success(function (data, status, headers, config) {
    //         console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
    //     }).error(function (data, status, headers, config) {
    //         console.log('error status: ' + status);
    //     })
    // };

}]);
angular.module('app').service('PhotosSvc', function($http) {
  // this.fetchAllHabits = function() {
  //   return $http.get('/api/habits')
  // }
  // this.createHabit = function(habit) {
  //   return $http.post('/api/habits', habit)
  // }

  this.createImage = function(photo) {
  	console.log('createImage photo: ', photo);
    // debugger;
  	return $http.post('/api/photos/upload_repository', photo)
  			.then(function(response) {
  				var data = response.data;
  				console.log('createImage data: ', data);
  				return { data: data };
  			})

  }
  this.storeImage = function(files) {
    console.log('storeImage files: ', files);
    return $http.post('/api/photos/upload', files)
        .then(function(response) {
          var data = response.data;
          console.log('createImage data: ', data);
          return { data: data };
        })

  }


})
angular.module('app').controller('RegisterCtrl', ['$scope', 'Upload', '$timeout', 'UserSvc', function ($scope, Upload, $timeout, UserSvc) {
    
    $scope.photo = null;
    $scope.user = {}

    $scope.uploadFiles = function(file) {
        $scope.user.photo = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                // url: 'mongodb://localhost/onehabitayear', // node.js route
                url: 'http://localhost:3000/api/photos', // node.js route
                // method: 'POST',
                file: file,
                data: { 
                  photo : file,
                  user_id: '1234'
                }
                // headers: {'header-key': 'header-value'}, 
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });

            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                                       evt.loaded / evt.total));
            });
        }   
    }

    $scope.register = function(user) {
      UserSvc.createUser(user)
      .then(function (response) {
        $scope.$emit('login', response.data)
      })
    }
}]);
angular.module('app').controller('ReportsCtrl', function($scope, FormsSvc, UserSvc, WeeksSvc) {
    


})
angular.module('app').service('ReportsSvc', function($http) {

})
angular.module('app').config(function ($routeProvider) {
  // $locationProvider.html5Mode(true)
  $routeProvider
  .when('/', { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/logout', { controller: 'ApplicationCtrl', templateUrl: 'logout.html' })
  .when('/habits', { controller: 'HabitsCtrl', templateUrl: 'habits.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/photos', { controller: 'PhotosCtrl', templateUrl: 'photos.html' })
  .when('/forms', { controller: 'FormsCtrl', templateUrl: 'forms.html' })
  .when('/admin', { controller: 'AdminCtrl', templateUrl: 'admin.html' })
  .when('/team', { controller: 'AdminCtrl', templateUrl: 'team.html' })
})

angular.module('app').service('UserSvc', function($http) {
  var svc = this

  svc.setNewUserWeek = function(user, current_week) {
    // console.log('UserSvc setNewUserWeek')
    return $http.post('/api/weeks', { current_week: current_week }).then(function(response) {
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
      username: username, 
      password: password
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
      username: user.username, 
      password: user.password, 
      name: user.name, 
      email: user.email,
      phone: user.phone, 
      year: user.year,
      city: user.city, 
      state: user.state, 
      country: user.country
    }).then(function (data) {
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