module.exports = function(grunt) {

	grunt.initConfig({
		lint : {
			all : [ 'grunt.js', 'public/javascripts/models/*.js',
					'public/javascripts/collections/*.js',
					'public/javascripts/views/*.js',
					'public/javascripts/routers/*.js' ]
		},
		jshint : {
			options : {
				browser : true
			}
		},
		jasmine : {
			amd : true,
			specs : 'public/javascripts/tests/spec/*.js',
			helpers : [ 'public/javascripts/lib/require-2.1.2.js', 'public/javascripts/tests/SpecRunner.js' ]
		}
	});

	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.registerTask('default', 'lint jasmine');

};