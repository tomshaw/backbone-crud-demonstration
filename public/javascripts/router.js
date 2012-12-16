
var AppRouter = Backbone.Router.extend({

    page: 1,

    routes: {
        "": "home",
        "index/page/:page": "pages",
        "index/page/:page/order/:order/sort/:sort": "sorting",
        "index/add": "addCustomer",
        "index/edit/customer_id/:id": "editCustomer",
        "index/view/customer_id/:id": "viewCustomer"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function () {
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            success: function (resp) {
                var page = resp.pages.current;
                $("#content").html(new CustomerListView({
                    model: customerListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    },

    pages: function (page) {
        var page = page ? parseInt(page, 10) : 1;
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            data: {
                page: page
            },
            success: function (resp) {
                $("#content").html(new CustomerListView({
                    model: customerListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
        this.page = page;
    },
    
    sorting: function (page, order, sort) {
    	console.log('page', page);
    	console.log('order', order);
    	console.log('sort', sort);
        var page = page ? parseInt(page, 10) : 1;
        var customerListCollection = new CustomerListCollection();
        customerListCollection.fetch({
            data: {
                page: page,
                order: order,
                sort: sort
            },
            success: function (resp) {
                $("#content").html(new CustomerListView({
                    model: customerListCollection,
                    page: page,
                    order: order,
                    sort: sort
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
        this.page = page;
    },

    addCustomer: function () {
        var customer = new CustomerAdd();
        $('#content').append(new CustomerAddView({
            model: customer
        }).render().el);
        $("#customer-form-modal").modal({
            show: true,
            backdrop: true,
            keyboard: true
        });
        $("#customer-form-modal").show();
        $("#modal-header").html("Add Customer");
        utils.hideAlert();
        this.headerView.menuItem('add-menu');
    },

    editCustomer: function (customer_id) {
        var customer = new Customer({
            customer_id: customer_id
        });
        var currentPage = this.page;
        customer.fetch({
            success: function () {
                $(document.body).append(new CustomerModalView().el);
                $('#customer-modal-body').html(new CustomerEditView({
                    model: customer,
                    page: currentPage
                }).render().el);
                $("#customer-form-modal").modal({
                    show: true,
                    backdrop: true,
                    keyboard: true
                });
                $("#customer-form-modal").show();
                $("#modal-header").html("Edit Customer");
                try {
                    $('#create_date').datepicker({
                        dateFormat: 'yy-mm-dd'
                    });
                } catch (error) {
                    if (console) console.log('datepicker error: ' + error.message);
                }
            }
        });
        this.headerView.menuItem('home-menu');
    },

    viewCustomer: function (customer_id) {
        var customer = new Customer({
            customer_id: customer_id
        });
        customer.fetch({
            success: function () {
                $("#content").html(new CustomerReviewView({
                    model: customer
                }).el);
            }
        });
        this.headerView.menuItem('home-menu');
    }

});

var app = new AppRouter();
Backbone.history.start();