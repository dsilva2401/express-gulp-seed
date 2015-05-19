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


gulp.task('create-module', function(name, template) {
	if(!name) throw new Error('Module name not defined');
	template = template || 'basic';
	var templateConfig = {};

	// Set templateConfig
		switch( template ) {
			case 'basic':
				templateConfig.template = 'angular-layout';
				templateConfig.mainFile = '(function(ang) {\n\n\tvar app = ang.module(\'app\', []);\n\n})(angular)';
				templateConfig.mainConfig = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.config([function() {\n\t\t\n\t}]);\n\n})(angular)';
				templateConfig.mainDirective = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.directive(\'appContainer\', [function() {\n\t\treturn {\n\t\t\trestrict: \'EA\',\n\t\t\ttemplateUrl: \'modules/'+name+'/app/main.html\',\n\t\t\tcontroller: \'appContainer\'\n\t\t};\n\t}]);\n\n})(angular)';
				templateConfig.mainController = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.controller(\'appContainer\', [\'$scope\', function( $scope ) {\n\n\t}]);\n\n})(angular)';
				templateConfig.mainTemplate = '<h1>'+name+'</h1>';
			break;
			case 'material':
				templateConfig.template = 'material-angular-layout';
				templateConfig.mainFile = '(function(ang) {\n\n\tvar app = ang.module(\'app\', [\'ngMaterial\']);\n\n})(angular)';
				templateConfig.mainConfig = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.config( [\'$mdThemingProvider\', function( $mdThemingProvider ) {\n\t\t$mdThemingProvider.theme(\'default\').primaryPalette(\'blue\');\n\t}]);\n\n})(angular)';
				templateConfig.mainDirective = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.directive(\'appContainer\', [function() {\n\t\treturn {\n\t\t\trestrict: \'EA\',\n\t\t\ttemplateUrl: \'modules/'+name+'/app/main.html\',\n\t\t\tcontroller: \'appContainer\'\n\t\t};\n\t}]);\n\n})(angular)';
				templateConfig.mainController = '(function(ang) {\n\n\tvar app = ang.module(\'app\');\n\n\tapp.controller(\'appContainer\', [\'$scope\', \'$mdSidenav\', function( $scope, $mdSidenav ) {\n\t\t$scope.models = {};\n\t\t$scope.methods = {};\n\t\t$scope.methods.toggleSideNav = function() {\n\t\t\t$mdSidenav(\'left\').toggle();\n\t\t}\n\n\t}]);\n\n})(angular)';
				templateConfig.mainTemplate = '<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left">\n</md-sidenav>\n\n<md-content layout="column" flex>\n\n\t<md-toolbar>\n\t\t<h1 class="md-toolbar-tools">App</h1>\n\t</md-toolbar>\n\n\t<md-content style="background:#eee;" flex layout>\n\t\t<button ng-click="methods.toggleSideNav()">Open</button>\n\t</md-content>\n\n</md-content>';
			break;
			default:
				throw new Error('Template not defined, available templates: basic, material');
				return;
			break;
		}

	// Filter name
		name = name.toLowerCase();

	// Create controller
		fs.writeFileSync('app/controllers/'+name+'.js',
			'var express = require(\'express\'),\n\trouter = express.Router(),\n\tgetModuleFiles = require(\'../../useful/getModuleFiles\'),\n\tmodels = require(\'../models\');\n\nmodule.exports = function (app) {\n\tapp.use(\'/'+name+'\', router);\n};\n\nrouter.get(\'/\', function (req, res, next) {\n\t// models.Article.findAll().then(function (articles) {\n\t// });\n\tres.render(\''+templateConfig.template+'\', {\n\t\ttitle: \''+name+'\',\n\t\tmodule: \''+name+'\',\n\t\tscripts: getModuleFiles(\''+name+'\')\n\t});\n});\n'
		);

	// Create public module
		fs.mkdirSync('./public/modules/'+name);
		fs.mkdirSync('./public/modules/'+name+'/app');
		fs.writeFileSync('./public/modules/'+name+'/app/main.js', templateConfig.mainFile );
		fs.writeFileSync('./public/modules/'+name+'/app/main.config.js', templateConfig.mainConfig );
		fs.writeFileSync('./public/modules/'+name+'/app/main.directive.js', templateConfig.mainDirective );
		fs.writeFileSync('./public/modules/'+name+'/app/main.html', templateConfig.mainTemplate );
		fs.writeFileSync('./public/modules/'+name+'/app/main.controller.js', templateConfig.mainController );

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
