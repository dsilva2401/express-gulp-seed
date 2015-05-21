var gulp = require('gulp-param')(require('gulp'), process.argv),
	gulpTasks = require('./gulptasks'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	order = require("gulp-order"),
	watch = require('gulp-watch');

gulp.task('create-module', function(name, template) {
	gulpTasks.createModule({
		name: name,
		template: template
	});
});

gulp.task('remove-module', function(name) {
	gulpTasks.removeModule({
		name: name
	});
});

gulp.task('create-model', function(name) {
	gulpTasks.createModel({
		name: name
	});
});

gulp.task('remove-model', function(name) {
	gulpTasks.removeModel({
		name: name
	});
});

gulp.task('install-plugin', function(name) {
	gulpTasks.installPlugin({
		name: name
	});
});

gulp.task('remove-plugin', function(name) {
	gulpTasks.removePlugin({
		name: name
	});
});

gulp.task('develop', function () {
	gulpTasks.serverUp();
});

gulp.task('default', function() {
	console.log('\n\n');
	console.log( 'Task not defined..' );
	console.log( 'Available tasks:' );
	console.log( 'gulp create-module --name <module-name> --template <template-name>' );
	console.log( 'gulp remove-module --name <module-name>' );
	console.log( 'gulp create-model --name <model-name>' );
	console.log( 'gulp remove-model --name <model-name>' );
	console.log( 'gulp install-plugin --name <plugin-name>' );
	console.log( 'gulp remove-plugin --name <plugin-name>' );
	console.log( 'gulp develop' );
	console.log('\n\n');
});