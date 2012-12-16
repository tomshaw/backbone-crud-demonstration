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

window.HeaderView = Backbone.View.extend({

    template: "#HeaderView",

    initialize: function (options) {
        this.template = _.template($(this.template).html());
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    menuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});

window.CustomerListView = Backbone.View.extend({

    template: _.template($('#CustomerListView').html()),
    
    page: 1,

    initialize: function (options) {
        this.page = this.options.page;
        this.model.bind("reset", this.render, this);
        this.model.bind("change", this.render, this);
    },

    events: {
        "mouseenter tr td button": "buttonOn",
        "mouseleave tr td button": "buttonOff",
        "click tr": "tableRowClick",
        "click tr td button#delete": "tableRowDeleteButton",
        "click tr td button#view": "tableRowViewButton"
    },

    render: function (event) {
        $(this.el).html(this.template({
            customers: this.model,
            page: this.page
        }));
        $(this.el).prepend(new PaginatorTemplate({
            model: this.model
        }).render().el);
        return this;
    },

    buttonOn: function (event) {
        $(this.el).undelegate('tr', 'click');
    },

    buttonOff: function (event) {
        $(this.el).delegate('tr', 'click', this.tableRowClick);
    },

    tableRowClick: function (event) {
        utils.hideAlert();
        var href = $(event.target).closest('tr').attr('data-href');
        app.navigate(href, true);
    },

    tableRowDeleteButton: function (event) {
        utils.hideAlert();
        var customerId = $(event.target).closest('tr').attr('id');
        customerDelete.set({
            customer_id: customerId
        });
        //customerDelete.get("customer_id");
        customerDelete.destroy({
            success: function (response) {
                app.navigate("/", true);
                //window.history.back();
            }
        });
        return false;
    },

    tableRowViewButton: function (event) {
        var customerId = $(event.target).closest('tr').attr('id');
        app.navigate("#index/view/customer_id/" + customerId, true);
    }

});

window.PaginatorTemplate = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($("#PaginatorTemplate").html());
    },

    render: function (event) {
        $(this.el).html(this.template({
            data: this.model.getPages()
        }));
        return this;
    }
});

window.CustomerModalView = Backbone.View.extend({

    events: {
        "click #submit": "clickHandler"
    },

    clickHandler: function (event) {
        $("#customer-form-modal").modal('hide');
        this.eventAggregator.trigger('beforeSave');
    },

    initialize: function (options) {
        this.template = _.template($("#CustomerModalView").html());
        this.render();
    },

    render: function (event) {
        $(this.el).html(this.template());
        return this;
    }

});

window.CustomerAddView = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($("#CustomerAddView").html());
        this.render();
    },

    events: {
        "change": "change",
        "click #submit": "beforeSave"
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    render: function (event) {
        $(this.el).html(this.template(_.extend(this.model.toJSON())));
        return this;
    },

    beforeSave: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.addCustomer();
        return false;
    },

    addCustomer: function () {
        $("#customer-form-modal").modal('hide');
        var page = 1;
        this.model.save(null, {
            success: function (response) {
                app.navigate('#index/page/' + page, true);
                utils.showAlert('Success!', 'Customer saved successfully!', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred saving this customer.', 'alert-error');
            }
        });
    }
});

window.CustomerEditView = Backbone.View.extend({

    page: 1,

    initialize: function (options) {
        this.template = _.template($("#CustomerEditView").html());
        this.render();
        this.eventAggregator.bind('beforeSave', this.beforeSave, this);
    },

    setPage: function (page) {
        this.page = page;
        return this;
    },

    getPage: function () {
        return this.page;
    },

    events: {
        "change": "change"
    },

    change: function (event) {
        utils.hideAlert();
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    render: function (event) {
        $(this.el).html(this.template(_.extend(this.model.toJSON())));
        return this;
    },

    beforeSave: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.updateCustomer();
        return false;
    },

    updateCustomer: function () {
        var page = this.getPage();
        this.model.save(null, {
            success: function (response) {
                app.navigate('#index/page/' + page, true);
                utils.showAlert('Success!', 'Customer has been updated successfully!', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while updating this customer.', 'alert-error');
            }
        });
    }
});

window.CustomerReviewView = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($("#CustomerReviewView").html());
        this.render();
    },

    render: function (event) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

var AppRouter = Backbone.Router.extend({

    page: 1,

    routes: {
        "": "home",
        "index/page/:page": "pages",
        "index/add": "addCustomer",
        "index/edit/customer_id/:id": "editCustomer",
        "index/view/customer_id/:id": "viewCustomer"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function () {
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            success: function (resp) {
                var page = resp.pages.current;
                $("#content").html(new CustomerListView({
                    model: customerListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    },

    pages: function (page) {
        var page = page ? parseInt(page, 10) : 1;
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            data: {
                page: page
            },
            success: function (resp) {
                $("#content").html(new CustomerListView({
                    model: customerListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
        this.page = page;
    },

    addCustomer: function () {
        var customer = new CustomerAdd();
        $('#content').append(new CustomerAddView({
            model: customer
        }).render().el);
        $("#customer-form-modal").modal({
            show: true,
            backdrop: true,
            keyboard: true
        });
        $("#customer-form-modal").show();
        $("#modal-header").html("Add Customer");
        utils.hideAlert();
        this.headerView.menuItem('add-menu');
    },

    editCustomer: function (customer_id) {
        var customer = new Customer({
            customer_id: customer_id
        });
        var currentPage = this.page;
        customer.fetch({
            success: function () {
                $(document.body).append(new CustomerModalView().el);
                $('#customer-modal-body').html(new CustomerEditView({
                    model: customer
                }).setPage(currentPage).render().el);
                $("#customer-form-modal").modal({
                    show: true,
                    backdrop: true,
                    keyboard: true
                });
                $("#customer-form-modal").show();
                $("#modal-header").html("Edit Customer");
                try {
                    $('#create_date').datepicker({
                        dateFormat: 'yy-mm-dd'
                    });
                } catch (error) {
                    if (console) console.log('datepicker error: ' + error.message);
                }
            }
        });
        this.headerView.menuItem('home-menu');
    },

    viewCustomer: function (customer_id) {
        var customer = new Customer({
            customer_id: customer_id
        });
        customer.fetch({
            success: function () {
                $("#content").html(new CustomerReviewView({
                    model: customer
                }).el);
            }
        });
        this.headerView.menuItem('home-menu');
    }

});

var app = new AppRouter();
Backbone.history.start();