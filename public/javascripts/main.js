requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(), // force browser to retrieve file from server not cache
    //enforceDefine: true, // modules must use define
    //baseUrl: "scripts", // the root path to use for all module lookups
    waitSeconds: 200, // seconds to wait before giving up on loading a script. Setting to 0 disables timeout, default is 7 seconds.
    shim: {
        'underscore': {
            deps: [],
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'handlebars': {
            deps: [],
            exports: 'Handlebars'
        },
    },

    paths: {
        jquery: 'lib/jquery-1.8.3',
        jqueryui: 'lib/jquery-ui-1.9.2.min',
        underscore: 'lib/underscore-1.4.3',
        backbone: 'lib/backbone-0.9.9',
        bootstrap: 'lib/bootstrap',
        handlebars: 'lib/handlebars-1.0.rc.1',
        utils: 'utils',
        Router: 'routers/router',
        EmailCheck: 'models/emailcheck',
        NameCheck: 'models/namecheck',
        User: 'models/user',
        UserAdd: 'models/useradd',
        UserDelete: 'models/userdelete',
        UserList: 'models/userlist',
        UserListCollection: 'collections/userlistcollection',
        HeaderView: 'views/headerview',
        PaginatorView: 'views/paginatorview',
        ProfilerView: 'views/profilerview',
        UserAddView: 'views/useraddview',
        UserEditView: 'views/usereditview',
        UserListView: 'views/userlistview',
        UserModalView: 'views/usermodalview',
        UserReviewView: 'views/userreviewview'
    }
});

define('App', [
    'jquery',
    'underscore',
    'backbone',
    'Router'
], function ($, _, Backbone, Router) {
    function initialize() {
        var app = new Router();
        Backbone.history.start();
    }
    return {
        initialize: initialize
    };
});

require(['App'], function (App, Client) {
    App.initialize();
});