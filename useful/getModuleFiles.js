var glob = require('glob');
var path = require('path');

var moduleFilesByPattern = function( mName, ps ) {
	var bname = path.join( process.cwd(),'public/modules', mName);
	var f = [];
	ps.forEach(function(p) {
		f = f.concat( glob.sync( path.join(bname,p) ) );
	});
	for(var i=0;i<f.length;i++){
		f[i] = path.relative( path.join(process.cwd(),'/public') , f[i]);
	}
	return f.filter(function(elem, pos) {
		return f.indexOf(elem) == pos;
	});
}

module.exports = function(mName) {

	return moduleFilesByPattern( mName, [
		'app/+([a-z]).js',
		'app/*.config.js',
		'app/*.controller.js',
		'app/*.directive.js',
		'*/+([a-z]).js',
		'*/*.directive.js',
	]);
	
}