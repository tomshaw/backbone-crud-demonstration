define('UserDelete', [
    'jquery',
    'underscore',
    'backbone',
    'User'
], function ($, _, Backbone, User) {

    var UserDelete = User.extend({
        urlRoot: "index/delete/id"
    });

    return UserDelete;

});