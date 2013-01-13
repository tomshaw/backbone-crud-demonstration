define('HeaderView', [
    'jquery',
    'underscore',
    'backbone'], function ($, _, Backbone) {

    var HeaderView = Backbone.View.extend({

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

    return HeaderView;
});