module.exports = function( grunt ) {
    "use strict";

    grunt.registerTask("mytask", function(option) {
        var done = this.async();
        var concat = grunt.config('concat');
        var min = grunt.config('min');
        
        //grunt.warn('This is a cool warning.');

        grunt.log.write("Running Custom MyTask!!! \n");
        
        var pkg = require('../package.json');
        
        console.log('BBCRUD: ' + pkg.description + ' (v' + pkg.version + ')');
        console.log('');
      
        grunt.task.run('concat min');
        
        done();

    });

};