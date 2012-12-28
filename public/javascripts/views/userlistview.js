define('UserListView', [
    'jquery',
    'jquery-ui',
    'utils',
    'underscore',
    'backbone',
    'PaginatorView',
    'ProfilerView',
    'UserDelete'
], function ($, ui, utils, _, Backbone, PaginatorView, ProfilerView, UserDelete) {
	
    var UserListView = Backbone.View.extend({

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
            $(this.el).prepend(new PaginatorView({
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
            	Backbone.history.navigate(href, true);
            }
        },

        tableRowDeleteButton: function (event) {
            utils.hideAlert();
            var userId = $(event.target).closest('tr').attr('id');
            var userDelete = new UserDelete();
            userDelete.set({
                id: userId
            });
            userDelete.destroy({
                success: function (response) {
                	Backbone.history.navigate('#index/page/1', true);
                    utils.showAlert('Success!', 'Customer deleted successfully!', 'alert-success');
                    //window.history.back();
                }
            });
            return false;
        },

        tableRowViewButton: function (event) {
            var userId = $(event.target).closest('tr').attr('id');
            Backbone.history.navigate("#index/view/id/" + userId, true);
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
        	Backbone.history.navigate("/", true);
        }

    });

    return UserListView;
});