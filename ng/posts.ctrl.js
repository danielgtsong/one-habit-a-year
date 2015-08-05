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