var app = angular.module('app', [])

app.controller('PostsCtrl', function ($scope, PostsSvc) {
  $scope.posts = [];

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

  // $http.get('/api/posts').success(function (posts) {
  PostsSvc.fetch().success(function (posts) {
    // console.log('$http.get called')
    $scope.posts = posts
  })
})

app.service('PostsSvc', function($http) {
  this.fetch = function() {
    return $http.get('/api/posts')
  }
  this.create = function(post) {
    return $http.post('/api/posts', post)
  }
})