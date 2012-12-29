/**
 * References:
 * Require.js Optimization Ð part2
 * http://www.svlada.com/blog/2012/07/02/require-js-optimization-part2/#t0
 * Preprocessing Modules with RequireJS Optimizer
 * http://www.ericfeminella.com/blog/2012/03/24/preprocessing-modules-with-requirejs-optimizer/
 */
var requirejs = require("requirejs");

var config = {
    baseUrl: "javascripts",
    appDir: "../public",
    dir: "../deploy",
    mainConfigFile: "../public/javascripts/main.js",
    optimizeCss: "standard",
    fileExclusionRegExp: /(^\.|build|deploy)/,
    onBuildWrite: function (name, path, contents) {
        console.log("Compiling: " + name);
        return contents
    },
    modules: [{
        name: "main"
    }]
}

requirejs.optimize(config, function (results) {
    console.log(results);
});