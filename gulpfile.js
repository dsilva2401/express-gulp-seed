var gulp = require('gulp-param')(require('gulp'), process.argv),
	nodemon = require('gulp-nodemon'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	order = require("gulp-order"),
	watch = require('gulp-watch'),
	rmdir = require( 'rmdir' ),
	shell = require('shelljs'),
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
		rmdir('./public/modules/'+name, function() {});
});


gulp.task('create-model', function(name) {
	if(!name) throw new Error('Model name not defined');
	// Create  model
		fs.writeFileSync('./app/models/'+name.toLowerCase()+'.js',
			'module.exports = function (sequelize, DataTypes) {\n\n\tvar '+name+' = sequelize.define(\''+name+'\', {\n\t\ttitle: DataTypes.STRING,\n\t\turl: DataTypes.STRING,\n\t\ttext: DataTypes.STRING\n\t}, {\n\t\tclassMethods: {\n\t\t\tassociate: function (models) {\n\t\t\t\t// example on how to add relations\n\t\t\t\t// '+name+'.hasMany(models.Comments);\n\t\t\t}\n\t\t}\n\t});\n\n\treturn '+name+';\n};'
		);
	// Create service
		fs.writeFileSync('./app/services/'+name.toLowerCase()+'.js',
			'var models = require(\'../models\');\n\nmodule.exports = function (router) {\n\t\n\t// GET\n\t\trouter.get(\'/'+name.toLowerCase()+'s\', function (req, res, next) {\n\t\t\tmodels.'+name+'.findAll().then(function ('+name.toLowerCase()+'s) {\n\n\t\t\t\tres.json('+name.toLowerCase()+'s);\n\t\t\t\t\n\t\t\t});\n\t\t});\n\n\t\trouter.get(\'/'+name.toLowerCase()+'s/:'+name.toLowerCase()+'Id\', function (req, res, next) {\n\t\t\tmodels.'+name+'.findOne( req.params.'+name.toLowerCase()+'Id ).then(function ('+name.toLowerCase()+') {\n\n\t\t\t\tres.json('+name.toLowerCase()+');\n\t\t\t\t\n\t\t\t});\n\t\t});\n\n}'
		);
});

gulp.task('remove-model', function(name) {
	if(!name) throw new Error('Model name not defined');
	// Remove model
		fs.unlinkSync('./app/models/'+name.toLowerCase()+'.js');
	// Remove service
		fs.unlinkSync('./app/services/'+name.toLowerCase()+'.js');
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

gulp.task('install-plugin', function(name) {
	if(!name) {
		var availablePlugins = fs.readdirSync('plugins');
		console.log('\n\n');
		console.log('Available plugins:');
		availablePlugins.forEach(function(plugin) {
			console.log('gulp install-plugin --name '+plugin);
		});
		console.log('\n\n');
		return;
	}
	// console.log( shell.which(name) );
	var pluginPath = 'plugins/'+name;
	var componentsMap = {
		'views': 'app/views',
		'models': 'app/models',
		'services': 'app/services',
		'controllers': 'app/controllers',
		'public-modules': 'public/modules'
	}
	var pluginComponents = fs.readdirSync(pluginPath);
	console.log( 'Installing plugin '+name+'..' );
	pluginComponents.forEach(function (pComponent) {
		shell.exec('cp -rv '+pluginPath+'/'+pComponent+'/* '+componentsMap[pComponent]+'/');
	});
	console.log('Plugin installed..');
	shell.exec( 'cat '+pluginPath+'/README.md' );
});

gulp.task('remove-plugin', function(name) {
	if(!name) throw new Error('Plugin name not defined');
	var pluginPath = 'plugins/'+name;
	var componentsMap = {
		'views': 'app/views',
		'models': 'app/models',
		'services': 'app/services',
		'controllers': 'app/controllers',
		'public-modules': 'public/modules'
	}
	var pluginComponents = fs.readdirSync(pluginPath);
	console.log( 'Removing plugin '+name+'..' );
	pluginComponents.forEach(function (pComponent) {
		var componentItems = fs.readdirSync( pluginPath+'/'+pComponent );
		componentItems.forEach(function (componentItem) {
			shell.exec( 'rm -rfv '+componentsMap[pComponent]+'/'+componentItem );
		});
	});
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
