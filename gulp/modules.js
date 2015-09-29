var gulp = require('gulp')

gulp.task('modules', function() {
  gulp.src('node_modules/ng-file-upload/dist/**/*.js')
  .pipe(gulp.dest('assets'))
})