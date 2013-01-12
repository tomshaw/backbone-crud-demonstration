require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        jquery: '../lib/jquery-1.8.3',
        jqueryui: '../lib/jquery-ui-1.9.2.min',
        underscore: '../lib/underscore-1.4.3',
        backbone: '../lib/backbone-0.9.9',
        jasmine: 'lib/jasmine-1.3.1/jasmine',
        jasminehtml: 'lib/jasmine-1.3.1/jasmine-html',
        utils: '../utils',
        Router: '../routers/router',
        EmailCheck: '../models/emailcheck',
        NameCheck: '../models/namecheck',
        User: '../models/user',
        UserAdd: '../models/useradd',
        UserDelete: '../models/userdelete',
        UserList: '../models/userlist',
        UserListCollection: '../collections/userlistcollection',
        HeaderView: '../views/headerview',
        PaginatorView: '../views/paginatorview',
        ProfilerView: '../views/profilerview',
        UserAddView: '../views/useraddview',
        UserEditView: '../views/usereditview',
        UserListView: '../views/userlistview',
        UserModalView: '../views/usermodalview',
        UserReviewView: '../views/userreviewview'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        jasminehtml: {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

define(['jquery', 'underscore', 'jasminehtml'], function ($, _, jasmine) {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('spec/MySpec');

    $(function () {
        require(specs, function () {
            jasmineEnv.execute();
        });
    });
});