define('PaginatorView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var PaginatorView = Backbone.View.extend({

        initialize: function (options) {
            this.template = _.template($("#PaginatorView").html());
        },

        render: function (event) {
            $(this.el).html(this.template({
                data: this.model.getPages()
            }));
            return this;
        }
    });

    return PaginatorView;

});