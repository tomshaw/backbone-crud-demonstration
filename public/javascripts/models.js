Backbone.emulateHTTP = false;
Backbone.emulateJSON = false;

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

window.User = Backbone.Model.extend({
    urlRoot: "index/edit/id",
    idAttribute: "id",

    initialize: function () {
        this.validators = {};

        this.validators.first_name = function (value) {
            return value.length > 0 ? {
                isValid: true
            } : {
                isValid: false,
                message: "You must enter a first name."
            };
        };

        this.validators.last_name = function (value) {
            return value.length > 0 ? {
                isValid: true
            } : {
                isValid: false,
                message: "You must enter a last name."
            };
        };

        this.validators.email = function (value) {
            var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return (regexp.test(value) === true) ? {
                isValid: true
            } : {
                isValid: false,
                message: "You must enter a valid email address."
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
        first_name: "",
        last_name: "",
        password: "",
        email: "",
        identity: 0,
        verified: 0,
        created: "",
        updated: ""
    }
});

window.UserAdd = User.extend({
    urlRoot: "index/add",
    defaults: {
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        email: "",
        identity: 0,
        verified: 0,
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
            first_name: "",
            last_name: "",
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