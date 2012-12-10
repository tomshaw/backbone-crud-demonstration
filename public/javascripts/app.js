window.CustomerList = Backbone.Model.extend({
    urlRoot: "index/customers",
    defaults: {
        items: {
            active: "",
            address_id: "",
            create_date: "",
            customer_id: "",
            email: "",
            first_name: "",
            last_name: "",
            last_update: "",
            store_id: ""
        },
        pages: {
            current: "",
            currentItemCount: "",
            first: "",
            firstItemNumber: "",
            firstPageInRange: "",
            itemCountPerPage: "",
            last: "",
            lastItemNumber: "",
            lastPageInRange: "",
            next: "",
            pageCount: "",
            pagesInRange: {},
            totalItemCount: ""
        }
    }
});

window.CustomerListCollection = Backbone.Collection.extend({

    model: CustomerList,

    url: "index/customers",

    parse: function (response) {
        this.pages = response.pages;
        return response.items
    }
});

window.CustomerListView = Backbone.View.extend({

    template: _.template($('#CustomerListView').html()),

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.bind("change", this.render, this);
    },

    render: function (event) {
        $(this.el).html(this.template({
            customers: this.model.toJSON()
        }));
        $(this.el).prepend(new PaginatorTemplate({
            model: this.model
        }).render().el);
        return this;
    }

});

window.PaginatorTemplate = Backbone.View.extend({

    template: _.template($('#PaginatorTemplate').html()),

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.bind("change", this.render, this);
    },

    render: function (event) {
        $(this.el).html(this.template({
            data: this.model.pages
        }));
        return this;
    }
});

window.HeaderView = Backbone.View.extend({

    template: "#HeaderView",

    initialize: function () {
        this.initializeTemplate();
        this.render();
    },

    initializeTemplate: function () {
        this.template = _.template($(this.template).html());
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

var AppRouter = Backbone.Router.extend({
    routes: {
        ""                              : "home",
        "index/page/:page"              : "pages"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function () {
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            success: function () {
                $("#content").html(new CustomerListView({
                    model: customerListCollection
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    },

    pages: function (page) {
        var page = page ? parseInt(page, 10) : 1;
        console.log('current page: ', page);
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            data: {
                page: page
            },
            success: function () {
                $("#content").html(new CustomerListView({
                    model: customerListCollection
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    }
});

var app = new AppRouter();
Backbone.history.start();