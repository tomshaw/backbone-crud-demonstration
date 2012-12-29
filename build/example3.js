var requirejs = require("requirejs");

var config = {
    name: "main",
    out: "../deploy/main-built.js",
    mainConfigFile: "../public/javascripts/main.js",
    fileExclusionRegExp: /(^\.|build|deploy)/,
    onBuildWrite: function (name, path, contents) {
        console.log("Compiling: " + name);
        return contents
    }
}

requirejs.optimize(config, function (results) {
    console.log(results);
});