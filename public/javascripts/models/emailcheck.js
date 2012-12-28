define('EmailCheck', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var EmailCheck = Backbone.Model.extend({
        urlRoot: "index/email/email",
        idAttribute: "email"
    });

    return EmailCheck;

});