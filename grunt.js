module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg : '<json:package.json>',
		lint : {
			all : [ 'grunt.js', 'public/javascripts/models/*.js',
					'public/javascripts/collections/*.js',
					'public/javascripts/views/*.js' ],
			main : [ 'grunt.js', 'public/javascripts/models/*.js',
					'public/javascripts/collections/*.js',
					'public/javascripts/views/*.js' ]
		},
		jasmine : {
			amd : true,
			specs : 'public/javascripts/tests/spec/*.js',
			helpers : [ 'public/javascripts/lib/require-2.1.2.js',
					'public/javascripts/tests/SpecRunner.js' ]
		},
		watch : {
			files : '<config:lint.files>',
			tasks : 'main'
		},
		jshint : {
			options : {
				browser : true
			},
			all : [ 'grunt.js', 'public/javascripts/models/*.js',
					'public/javascripts/collections/*.js',
					'public/javascripts/views/*.js',
					'public/javascripts/routers/*.js' ]
		}
	});

	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.registerTask('default', 'lint jasmine');

};