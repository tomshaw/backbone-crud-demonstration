module.exports = function(grunt) {

  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'public/javascripts/models/*.js', 'public/javascripts/collections/*.js', 'public/javascripts/views/*.js', 'public/javascripts/routers/*.js']
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });
  
  grunt.registerTask('default', 'lint');

};