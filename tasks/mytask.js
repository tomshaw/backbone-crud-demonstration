module.exports = function( grunt ) {
    "use strict";
    
    exports.gitRecentChanges = function (callback) {
        grunt.util.spawn({
            cmd: "git",
            args: [ "show", "--pretty=format:", "--name-only", "HEAD" ]
        }, function( err, result ) {
            if (err) {
                return callback(err, null);
            }

            var changed = {};
            changed = grunt.utils._.compact(result.split("\n"));
            return callback(null, changed);
        });
    };

    grunt.registerTask("mytask", function(option) {
        var done = this.async();
        var concat = grunt.config('concat');
        var min = grunt.config('min');
        
        //grunt.warn('This is a cool warning.');

        grunt.log.write("Running BBCRUD Custom Tasks \n");
        
        var pkg = require('../package.json');
        
        console.log('BBCRUD: ' + pkg.description + ' (v' + pkg.version + ')');
        console.log('');
      
        //grunt.task.run('concat min');
        
        exports['gitRecentChanges'](function(err, files) {
            if (err) {
                grunt.log.error(err);
                return done(false);
            }
            console.log(files);
            done();
        });

    });

};