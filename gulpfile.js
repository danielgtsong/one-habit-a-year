var gulp = require('gulp')
// var concat = require('gulp-concat')
// var sourcemaps = require('gulp-sourcemaps')
// var uglify = require('gulp-uglify')
// var ngAnnotate = require('gulp-ng-annotate')
var fs = require('fs')

fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require('./gulp/' + task)
})

gulp.task('dev', ['watch:css', 'watch:js', 'dev:server'])