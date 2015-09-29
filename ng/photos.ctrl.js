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