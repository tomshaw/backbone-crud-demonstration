define('ProfilerView', [
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var ProfilerView = Backbone.View.extend({

        initialize: function (options) {
            this.profiler = this.options.profiler;
            this.template = Handlebars.compile($("#ProfilerView").html());
        },

        render: function (event) {
            $(this.el).html(this.template({
                data: this.profiler
            }));
            return this;
        }
    });

    return ProfilerView;

});