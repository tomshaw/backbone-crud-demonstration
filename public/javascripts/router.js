
var AppRouter = Backbone.Router.extend({

    page: 1,

    routes: {
        "": "home",
        "index/page/:page": "pages",
        "index/letter/:letter": "letters",
        "index/page/:page/order/:order/sort/:sort": "sorting",
        "index/add": "addUser",
        "index/edit/id/:id": "editUser",
        "index/view/id/:id": "viewUser"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function () {
        var userListCollection = new UserListCollection();
        userListCollection.fetch({
            success: function (resp) {
                var page = resp.pages.current;
                $("#content").html(new UserListView({
                    model: userListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    },

    pages: function (page) {
        var page = page ? parseInt(page, 10) : 1;
        var userListCollection = new UserListCollection();
        userListCollection.fetch({
            data: {
                page: page
            },
            success: function (resp) {
                $("#content").html(new UserListView({
                    model: userListCollection,
                    page: page
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
        this.page = page;
    },
    
    letters: function (letter) {
        var letter = letter ? letter : '';
        var userListCollection = new UserListCollection();
        userListCollection.fetch({
            data: {
                letter: letter
            },
            success: function (resp) {
                $("#content").html(new UserListView({
                    model: userListCollection,
                    letter: letter
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    },
    
    sorting: function (page, order, sort) {
        var page = page ? parseInt(page, 10) : 1;
        var userListCollection = new UserListCollection();
        userListCollection.fetch({
            data: {
                page: page,
                order: order,
                sort: sort
            },
            success: function (resp) {
                $("#content").html(new UserListView({
                    model: userListCollection,
                    page: page,
                    order: order,
                    sort: sort
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
        this.page = page;
    },

    addUser: function () {
        var user = new UserAdd();
        $('#content').append(new UserAddView({
            model: user
        }).render().el);
        $("#user-form-modal").modal({
            show: true,
            backdrop: true,
            keyboard: true
        });
        $("#user-form-modal").show();
        $("#modal-header").html("Add New User");
        utils.hideAlert();
        this.headerView.menuItem('add-menu');
    },

    editUser: function (id) {
        var user = new User({
            id: id
        });
        var currentPage = this.page;
        user.fetch({
            success: function (resp) {
                $(document.body).append(new UserModalView().el);
                $('#user-modal-body').html(new UserEditView({
                    model: user,
                    page: currentPage
                }).render().el);
                $("#user-form-modal").modal({
                    show: true,
                    backdrop: true,
                    keyboard: true
                });
                $("#user-form-modal").show();
                $("#modal-header").html("Edit User");
                try {
                    $('#created').datepicker({
                        dateFormat: 'yy-mm-dd'
                    });
                } catch (error) {
                    if (console) console.log('datepicker error: ' + error.message);
                }
            }
        });
        this.headerView.menuItem('home-menu');
    },

    viewUser: function (id) {
        var user = new User({
            id: id
        });
        user.fetch({
            success: function (resp) {
                $("#content").html(new UserReviewView({
                    model: user
                }).el);
                $("#profiler").html(new ProfilerView({
                    profiler: resp.attributes.profiler
                }).render().el);
            }
        });
        this.headerView.menuItem('home-menu');
    }

});

var app = new AppRouter();
Backbone.history.start();