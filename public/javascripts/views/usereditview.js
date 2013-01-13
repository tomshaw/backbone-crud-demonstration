define('UserEditView', [
    'jquery',
    'underscore',
    'backbone',
    'utils'], function ($, _, Backbone, utils) {

    var UserEditView = Backbone.View.extend({

        page: 1,

        initialize: function (options) {
            this.page = options.page;
            this.template = _.template($("#UserEditView").html());
            this.render();
            Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);
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
                    Backbone.history.navigate('#index/page/' + page, true);
                    utils.showAlert('Success!', 'System user has been updated successfully!', 'alert-success');
                },
                error: function () {
                    utils.showAlert('Error', 'An error occurred while updating this user.', 'alert-error');
                }
            });
        }
    });

    return UserEditView;

});