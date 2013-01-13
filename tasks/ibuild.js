module.exports = function(grunt) {
	grunt.registerTask('ibuild', function() {
		var pkg = grunt.file.readJSON('package.json');
		pkg.build = parseInt(pkg.build) + 1;
		grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
	});
};