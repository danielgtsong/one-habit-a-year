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