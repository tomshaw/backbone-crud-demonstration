define('UserAddView', [
    'jquery',
    'underscore',
    'utils',
    'backbone',
    'NameCheck',
    'EmailCheck'
], function ($, _, utils, Backbone, NameCheck, EmailCheck) {

    var UserAddView = Backbone.View.extend({

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
            var nameCheck = new NameCheck();
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
            var emailCheck = new EmailCheck();
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
                	Backbone.history.navigate('#index/page/' + page, true);
                    utils.showAlert('Success!', 'Customer saved successfully!', 'alert-success');
                },
                error: function () {
                    utils.showAlert('Error', 'An error occurred saving this customer.', 'alert-error');
                }
            });
        }
    });

    return UserAddView;

});