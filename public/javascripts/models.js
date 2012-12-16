Backbone.emulateHTTP = false;
Backbone.emulateJSON = false;

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

window.Customer = Backbone.Model.extend({
    urlRoot: "index/edit/customer_id",
    idAttribute: "customer_id",

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
        customer_id: "",
        store_id: 1,
        first_name: "",
        last_name: "",
        email: "",
        address_id: 5,
        active: 1,
        create_date: "",
        last_update: ""
    }
});

window.CustomerAdd = Customer.extend({
    urlRoot: "index/add",
    defaults: {
        store_id: 1,
        first_name: "",
        last_name: "",
        email: "",
        address_id: 5,
        active: 1,
        create_date: "",
        last_update: ""
    }
});

window.CustomerDelete = Customer.extend({
    urlRoot: "index/delete/customer_id"
});

var customerDelete = new CustomerDelete();

window.CustomerList = Backbone.Model.extend({
    urlRoot: "index/list",
    idAttribute: "customer_id",
    defaults: {
        items: {
            active: "",
            address: "",
            address2: "",
            address_id: "",
            city: "",
            city_id: "",
            country: "",
            country_id: "",
            create_date: "",
            customer_id: "",
            district: "",
            email: "",
            first_name: "",
            last_name: "",
            last_update: "",
            phone: "",
            postal_code: "",
            store_id: ""
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

window.CustomerListCollection = Backbone.Collection.extend({

    model: CustomerList,

    url: "index/list",

    parse: function (response) {
        this.pages = response.pages;
        return response.items;
    },

    getPages: function () {
        return this.pages;
    },

    getCurrentPage: function () {
        return this.pages.current;
    }
});