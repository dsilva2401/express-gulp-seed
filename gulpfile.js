var gulp = require('gulp-param')(require('gulp'), process.argv),
	nodemon = require('gulp-nodemon'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	order = require("gulp-order"),
	watch = require('gulp-watch'),
	rmdir = require( 'rmdir' ),
	fs = require('fs');


gulp.task('create-module', function(name) {
	if(!name) throw new Error('Module name not defined');
	// Filter name
		name = name.toLowerCase();

	// Create controller
		fs.writeFileSync('app/controllers/'+name+'.js',
			'var express = require(\'express\'),\n\trouter = express.Router(),\n\tgetModuleFiles = require(\'../../useful/getModuleFiles\'),\n\tmodels = require(\'../models\');\n\nmodule.exports = function (app) {\n\tapp.use(\'/'+name+'\', router);\n};\n\nrouter.get(\'/\', function (req, res, next) {\n\t// models.Article.findAll().then(function (articles) {\n\t// });\n\tres.render(\'angular-layout\', {\n\t\ttitle: \''+name+'\',\n\t\tmodule: \''+name+'\',\n\t\tscripts: getModuleFiles(\''+name+'\')\n\t});\n});\n'
		);

	// Create public module
		fs.mkdirSync('./public/modules/'+name);
		fs.mkdirSync('./public/modules/'+name+'/app');
		fs.writeFileSync('./public/modules/'+name+'/app/main.js',
			'(function(ang) {\n\n\tvar app = ang.module(\'app\', []);\n\n})(angular)'
		);
		fs.writeFileSync('./public/modules/'+name+'/app/main.directive.js',
			'(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.directive(\''+name+'\', [function() {\n\t\treturn {\n\t\t\trestrict: \'C\',\n\t\t\ttemplate: \'<h1>'+name+'</h1>\'\n\t\t};\n\t}]);\n\n})(angular)'
		);

});

gulp.task('remove-module', function(name) {
	if(!name) throw new Error('Module name not defined');
	// Filter name
		name = name.toLowerCase();
	// Delete controller
		fs.unlinkSync('app/controllers/'+name+'.js');
	// Delete public module
		rmdir('./public/modules/'+name);
});

gulp.task('develop', function () {
	livereload.listen();
	nodemon({
		script: 'app.js',
		ext: 'js coffee jade',
	}).on('restart', function () {
		setTimeout(function () {
			livereload.changed(__dirname);
		}, 500);
	});
});

// var modules = fs.readdirSync('./public/modules');
// modules.forEach(function(module) {
// 	gulp.task( 'develop-'+module, [ 'develop' ], function() {
// 		watch('public/modules/'+module+'/*/*.js', function() {
// 			gulp.src('public/modules/'+module+'/*/*.js')
// 				.pipe( order([
// 					// 'public/modules/'+module+'/app/main.js'
// 					// 'public/modules/'+module+'/app/*.js'
// 				], {
// 					base: './'
// 				}) )
// 				.pipe( concat(module+'.js') )
// 				.pipe( uglify() )
// 				.pipe( gulp.dest('./public/js/') );
// 		});
// 	});
// });


gulp.task('default', function() {
	console.log('\n\n');
	console.log( 'Not parameters defined..' );
	console.log( 'Available parameters:' );
	console.log( 'gulp create-module --name <module-name>' );
	console.log( 'gulp remove-module --name <module-name>' );
	console.log( 'gulp develop' );
	/*modules.forEach(function(m) {
		console.log( 'gulp develop-'+m+'' );
	});*/
	console.log('\n\n');
});
