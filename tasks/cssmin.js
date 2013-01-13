module.exports = function(grunt) {
  var exec = require('child_process').exec;
  grunt.registerTask('cssmin', function() {
    grunt.log.write("Minifying css using yuicompressor \n");
    var cmd = 'java -jar -Xss2048k '
      + __dirname + '/../yuicompressor-2.4.7.jar --type css '
      + grunt.template.process('<%=dirs.dest%>/css/style.css') + ' -o '
      + grunt.template.process('<%=dirs.dest%>/css/style.min.css')
    exec(cmd, function(err, stdout, stderr) {
      if(err) throw err;
    });
  });
};