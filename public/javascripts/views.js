window.HeaderView = Backbone.View.extend({
	
    el: ".header",
    
    template: "#HeaderView",

    initialize: function (options) {
        this.template = _.template($(this.template).html());
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    menuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});

window.UserListView = Backbone.View.extend({

    template: _.template($('#UserListView').html()),

    characters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    letter: false,

    page: 1,
    sort: 'asc',

    search: {
        username: "",
        fullname: "",
        email: "",
        identity: "-1",
        verified: "-1",
        created: ""
    },

    initialize: function (options) {
        this.page = this.options.page;
        this.sort = this.options.sort;
        this.letter = this.options.letter;
        this.model.bind("reset", this.render, this);
        this.model.bind("change", this.change, this);
    },

    events: {
        "mouseenter tr td button": "buttonOn",
        "mouseleave tr td button": "buttonOff",
        "click tr": "tableRowClick",
        "click tr td button#delete": "tableRowDeleteButton",
        "click tr td button#view": "tableRowViewButton",
        "click #grid-submit": "gridsubmit",
        "click #grid-reset": "gridreset"
    },

    render: function (event) {
        $(this.el).html(this.template({
            users: this.model,
            page: this.page,
            sort: this.sort == 'asc' ? 'desc' : 'asc',
            search: this.search,
            characters: this.characters,
            letter: this.letter
        }));
        $(this.el).prepend(new PaginatorTemplate({
            model: this.model
        }).render().el);
        $("#profiler").html(new ProfilerView({
            profiler: this.model.profiler
        }).render().el);
        try {
            $("input[id='data[created]']", this.el).datepicker({
                dateFormat: 'yy-mm-dd'
            });
        } catch (error) {
            if (console) console.log('datepicker error: ' + error.message);
        }
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
        if (typeof (href) !== "undefined") {
            app.navigate(href, true);
        }
    },

    tableRowDeleteButton: function (event) {
        utils.hideAlert();
        var userId = $(event.target).closest('tr').attr('id');
        userDelete.set({
            id: userId
        });
        userDelete.destroy({
            success: function (response) {
                app.navigate('#index/page/1', true);
                utils.showAlert('Success!', 'Customer deleted successfully!', 'alert-success');
                //window.history.back();
            }
        });
        return false;
    },

    tableRowViewButton: function (event) {
        var userId = $(event.target).closest('tr').attr('id');
        app.navigate("#index/view/id/" + userId, true);
    },

    gridsubmit: function (event) {
        this.search.username = this.$("input[id='data[username]']").val();
        this.search.fullname = this.$("input[id='data[fullname]']").val();
        this.search.email = this.$("input[id='data[email]']").val();
        this.search.identity = this.$("select[id='data[identity]']").val();
        this.search.verified = this.$("select[id='data[verified]']").val();
        this.search.created = $("input[id='data[created]']", this.el).val();
        this.model.fetch({
            data: this.search,
            type: 'POST'
        });
        utils.gridLoader();
    },

    gridreset: function (event) {
        app.navigate("/", true);
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

window.UserModalView = Backbone.View.extend({

    events: {
        "click #submit": "clickHandler"
    },

    clickHandler: function (event) {
        this.eventAggregator.trigger('beforeSave');
    },

    initialize: function (options) {
        this.template = _.template($("#UserModalView").html());
        this.render();
    },

    render: function (event) {
        $(this.el).html(this.template());
        return this;
    }

});

window.UserAddView = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($("#UserAddView").html());
        this.render();
    },

    events: {
        "change": "change",
        "blur input[id='username']": "checkUsername",
        "blur input[id='email']": "checkEmail",
        "click #submit": "beforeSave"
    },

    checkUsername: function (event) {
        var target = event.target;
        nameCheck.set({
            username: target.value
        });
        nameCheck.fetch({
            success: function (resp) {
                var check = resp.attributes;
                if (check.isValid === false) {
                    utils.addValidationError(target.id, check.message);
                } else if (!utils.stringRegex.test(target.value)) {
                    utils.addValidationError(target.id, 'You must enter a valid username.');
                } else {
                    utils.removeValidationError(target.id, check.message);
                }
            }
        });
    },

    checkEmail: function (event) {
        var target = event.target;
        emailCheck.set({
            email: target.value
        });
        emailCheck.fetch({
            success: function (resp) {
                var check = resp.attributes;
                if (check.isValid === false) {
                    utils.addValidationError(target.id, check.message);
                } else if (!utils.emailRegex.test(target.value)) {
                    utils.addValidationError(target.id, 'You must enter a valid email address.');
                } else {
                    utils.removeValidationError(target.id, check.message);
                }
            }
        });
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
        this.addUser();
        return false;
    },

    addUser: function () {
        $("#user-form-modal").modal('hide');
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

window.UserEditView = Backbone.View.extend({

    page: 1,

    initialize: function (options) {
        this.page = options.page;
        this.template = _.template($("#UserEditView").html());
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

    beforeSave: function (event) {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        utils.formLoader();
        this.updateUser();
        return false;
    },

    updateUser: function () {
        var page = this.getPage();
        this.model.save(null, {
            success: function (response) {
                app.navigate('#index/page/' + page, true);
                utils.showAlert('Success!', 'System user has been updated successfully!', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while updating this user.', 'alert-error');
            }
        });
    }
});

window.UserReviewView = Backbone.View.extend({

    initialize: function (options) {
        this.template = _.template($("#UserReviewView").html());
        this.render();
    },

    render: function (event) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

window.ProfilerView = Backbone.View.extend({

    initialize: function (options) {
        this.profiler = this.options.profiler;
        this.template = Handlebars.compile($("#ProfilerView").html() );
    },

    render: function (event) {
        $(this.el).html(this.template({
            data: this.profiler
        }));
        return this;
    }
});