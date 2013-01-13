module.exports = function(grunt) {
  var exec = require('child_process').exec;
  var path = require('path');
  var root = path.normalize(__dirname+"/build_master");

  grunt.registerTask('initrepo', function() {

      grunt.file.mkdir(root);

      var cmd = 'cd '+root+' && ';
      cmd += 'git init && ';
      cmd += 'git remote add -f -t master origin file:///path/to/git/repo && ';
      cmd += 'git checkout -t origin/master';

      exec(cmd, function(err, stdout, stderr) {
        if (err) throw err;
          grunt.log.write(stdout);
      });
  });
};