define('UserReviewView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var UserReviewView = Backbone.View.extend({

        initialize: function (options) {
            this.template = _.template($("#UserReviewView").html());
            this.render();
        },

        render: function (event) {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return UserReviewView;

});