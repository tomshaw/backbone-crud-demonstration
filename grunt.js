module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%=pkg.name%> - v<%=pkg.version%> (build <%=pkg.build%>) - ' + '<%=grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT")%> */'
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: ['public/javascripts/utils.js',
                    'public/javascripts/routers/router.js',
                    'public/javascripts/models/emailcheck.js',
                    'public/javascripts/models/namecheck.js',
                    'public/javascripts/models/user.js',
                    'public/javascripts/models/useradd.js',
                    'public/javascripts/models/userdelete.js',
                    'public/javascripts/models/userlist.js',
                    'public/javascripts/collections/userlistcollection.js',
                    'public/javascripts/views/headerview.js',
                    'public/javascripts/views/paginatorview.js',
                    'public/javascripts/views/profilerview.js',
                    'public/javascripts/views/useraddview.js',
                    'public/javascripts/views/usereditview.js',
                    'public/javascripts/views/userlistview.js',
                    'public/javascripts/views/usermodalview.js',
                    'public/javascripts/views/userreviewview.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        lint: {
            all: ['grunt.js', 'public/javascripts/models/*.js',
                'public/javascripts/collections/*.js',
                'public/javascripts/views/*.js'],
            main: ['grunt.js', 'public/javascripts/models/*.js',
                'public/javascripts/collections/*.js',
                'public/javascripts/views/*.js']
        },
        jasmine: {
            amd: true,
            specs: 'public/javascripts/tests/spec/*.js',
            helpers: ['public/javascripts/lib/require-2.1.2.js',
                'public/javascripts/tests/SpecRunner.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'main'
        },
        jshint: {
            options: {
                browser: true
            },
            all: ['grunt.js', 'public/javascripts/models/*.js',
                'public/javascripts/collections/*.js',
                'public/javascripts/views/*.js',
                'public/javascripts/routers/*.js']
        },
        concat: {
            dist: {
                src: ['public/javascripts/utils.js',
                    'public/javascripts/routers/router.js',
                    'public/javascripts/models/emailcheck.js',
                    'public/javascripts/models/namecheck.js',
                    'public/javascripts/models/user.js',
                    'public/javascripts/models/useradd.js',
                    'public/javascripts/models/userdelete.js',
                    'public/javascripts/models/userlist.js',
                    'public/javascripts/collections/userlistcollection.js',
                    'public/javascripts/views/headerview.js',
                    'public/javascripts/views/paginatorview.js',
                    'public/javascripts/views/profilerview.js',
                    'public/javascripts/views/useraddview.js',
                    'public/javascripts/views/usereditview.js',
                    'public/javascripts/views/userlistview.js',
                    'public/javascripts/views/usermodalview.js',
                    'public/javascripts/views/userreviewview.js'],
                dest: 'dist/built.js'
            }
        },
        min: {
            dist: {
                src: ['dist/built.js'],
                dest: 'dist/built.min.js'
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-runner');

    grunt.registerTask('default', 'lint concat min ibuild');
    
    grunt.registerTask('tests', 'jasmine');

};