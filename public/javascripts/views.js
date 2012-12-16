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
    sort: 'asc',

    initialize: function (options) {
        this.page = this.options.page;
        this.sort = this.options.sort;
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
            page: this.page,
            sort: this.sort == 'asc' ? 'desc' : 'asc'
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
        this.page = options.page;
        this.template = _.template($("#CustomerEditView").html());
        this.render();
        this.eventAggregator.bind('beforeSave', this.beforeSave, this);
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