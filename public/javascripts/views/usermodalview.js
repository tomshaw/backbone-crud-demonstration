define('UserModalView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var UserModalView = Backbone.View.extend({

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

    return UserModalView;

});