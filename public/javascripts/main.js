requirejs.config({
    shim: {
        'underscore': {
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
            exports: 'Handlebars'
        },
    },

    paths: {
        'jquery': 'libs/jquery-1.8.3',
        'jquery-ui': 'libs/jquery-ui-1.9.2.min',
        'underscore': 'libs/underscore-1.4.3',
        'backbone': 'libs/backbone-0.9.9',
        'bootstrap': 'libs/bootstrap',
        'handlebars': 'libs/handlebars-1.0.rc.1',
        'utils': 'utils',
        'Router': 'router',
        'EmailCheck': 'models/emailcheck',
        'NameCheck': 'models/namecheck',
        'User': 'models/user',
        'UserAdd': 'models/useradd',
        'UserDelete': 'models/userdelete',
        'UserList': 'models/userlist',
        'UserListCollection': 'collections/userlistcollection',
        'HeaderView': 'views/headerview',
        'PaginatorView': 'views/paginatorview',
        'ProfilerView': 'views/profilerview',
        'UserAddView': 'views/useraddview',
        'UserEditView': 'views/usereditview',
        'UserListView': 'views/userlistview',
        'UserModalView': 'views/usermodalview',
        'UserReviewView': 'views/userreviewview'
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