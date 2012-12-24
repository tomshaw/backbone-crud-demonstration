Backbone.emulateHTTP = false;
Backbone.emulateJSON = false;

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

window.NameCheck = Backbone.Model.extend({
    urlRoot: "index/username/username",
    idAttribute: "username"
});

var nameCheck = new NameCheck();

window.EmailCheck = Backbone.Model.extend({
    urlRoot: "index/email/email",
    idAttribute: "email"
});

var emailCheck = new EmailCheck();

window.User = Backbone.Model.extend({
    urlRoot: "index/edit/id",
    idAttribute: "id",

    initialize: function () {
        var self = this;
        this.validators = {};
        this.stringRegex = /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/;
        this.emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        this.validators.username = function (value) {
            if (value.length == 0) {
                return {
                    isValid: false,
                    message: 'You must choose a username.'
                };
            }
            if (!self.stringRegex.test(value)) {
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

        this.validators.full_name = function (value) {
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
            if (!self.emailRegex.test(value)) {
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
        full_name: "",
        password: "",
        email: "",
        identity: "-1",
        verified: "-1",
        created: "",
        updated: ""
    }
});

window.UserAdd = User.extend({
    urlRoot: "index/add",
    defaults: {
        username: "",
        full_name: "",
        password: "",
        email: "",
        identity: "-1",
        verified: "-1",
        created: "",
        updated: ""
    }
});

window.UserDelete = User.extend({
    urlRoot: "index/delete/id"
});

var userDelete = new UserDelete();

window.UserList = Backbone.Model.extend({
    urlRoot: "index/list",
    idAttribute: "id",
    defaults: {
        items: {
            id: "",
            username: "",
            full_name: "",
            password: "",
            email: "",
            identity: 0,
            verified: 0,
            created: "",
            updated: ""
        },
        pages: {
            current: "",
            currentItemCount: "",
            first: "",
            firstItemNumber: "",
            firstPageInRange: "",
            itemCountPerPage: "",
            last: "",
            lastItemNumber: "",
            lastPageInRange: "",
            next: "",
            pageCount: "",
            pagesInRange: {},
            totalItemCount: ""
        }
    }
});