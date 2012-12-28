define('UserAdd', [
    'jquery',
    'underscore',
    'backbone',
    'User'
], function ($, _, Backbone, User) {

    var UserAdd = User.extend({
        urlRoot: "index/add",
        defaults: {
            username: "",
            fullname: "",
            password: "",
            email: "",
            identity: "-1",
            verified: "-1",
            created: "",
            updated: ""
        }
    });

    return UserAdd;

});