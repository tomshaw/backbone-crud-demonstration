define('UserListCollection', [
    'jquery',
    'underscore',
    'backbone',
    'UserList'
], function ($, _, Backbone, UserList) {

    var UserListCollection = Backbone.Collection.extend({

        model: UserList,

        url: "index/list",

        parse: function (response) {
            this.pages = response.pages;
            this.profiler = response.profiler;
            return response.items;
        },

        getPages: function () {
            return this.pages;
        },

        getCurrentPage: function () {
            return this.pages.current;
        }
    });

    return UserListCollection;
});