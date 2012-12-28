define('NameCheck', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var NameCheck = Backbone.Model.extend({
        urlRoot: "index/username/username",
        idAttribute: "username"
    });

    return NameCheck;

});