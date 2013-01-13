module.exports = function(grunt) {

	grunt.initConfig({
		pkg : '<json:package.json>',
		lint : {
			all : [ 'grunt.js', 'public/javascripts/models/*.js',
					'public/javascripts/collections/*.js',
					'public/javascripts/views/*.js',
					'public/javascripts/routers/*.js' ]
		},
		jasmine : {
			amd : true,
			specs : 'public/javascripts/tests/spec/*.js',
			helpers : [ 'public/javascripts/lib/require-2.1.2.js',
					'public/javascripts/tests/SpecRunner.js' ]
		},
		watch : {
			files : '<config:lint.files>',
			tasks : 'default'
		},
		jshint : {
			options : {
				browser : true,
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				node : true,
				es5 : true,
				globals : {
					exports : true,
					require : true,
					module : true
				},
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