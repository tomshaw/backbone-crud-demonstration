define('User', [
    'jquery',
    'underscore',
    'utils',
    'backbone'
], function ($, _, utils, Backbone) {

    var User = Backbone.Model.extend({
        urlRoot: "index/edit/id",
        idAttribute: "id",

        initialize: function () {
            this.validators = {};
            this.validators.username = function (value) {
                if (value.length == 0) {
                    return {
                        isValid: false,
                        message: 'You must choose a username.'
                    };
                }
                if (!utils.stringRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'You must enter a valid username!'
                    };
                }
                return {
                    isValid: true,
                    message: 'Everything looks good!'
                };
            };

            this.validators.fullname = function (value) {
                if (value.length == 0) {
                    return {
                        isValid: false,
                        message: 'You must enter your full name.'
                    };
                }
                return {
                    isValid: true,
                    message: 'Completed successfully!'
                };
            };

            this.validators.email = function (value) {
                if (value.length == 0) {
                    return {
                        isValid: false,
                        message: 'You must enter an email address!'
                    };
                }
                if (!utils.emailRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'You must enter a valid email address!'
                    };
                }
                return {
                    isValid: true,
                    message: 'Completed successfully!'
                };
            };

            this.validators.identity = function (value) {
                return value == "-1" ? {
                    isValid: false,
                    message: "You must select a user identity level."
                } : {
                    isValid: true
                };
            };

            this.validators.validated = function (value) {
                return value == "-1" ? {
                    isValid: false,
                    message: "You must select if user has been validated."
                } : {
                    isValid: true
                };
            };
        },

        validateItem: function (key) {
            return (this.validators[key]) ? this.validators[key](this.get(key)) : {
                isValid: true
            };
        },

        validateAll: function () {

            var messages = {};

            for (var key in this.validators) {
                if (this.validators.hasOwnProperty(key)) {
                    var check = this.validators[key](this.get(key));
                    if (check.isValid === false) {
                        messages[key] = check.message;
                    }
                }
            }

            return _.size(messages) > 0 ? {
                isValid: false,
                messages: messages
            } : {
                isValid: true
            };
        },

        defaults: {
            id: "",
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

    return User;

});