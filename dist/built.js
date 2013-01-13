define('utils', [
    'jquery',
    'jqueryui'
], function ($, ui) {

	var utils = {
			
	    stringRegex: /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/,
	    emailRegex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
	
	    displayValidationErrors: function (messages) {
	        for (var key in messages) {
	            if (messages.hasOwnProperty(key)) {
	                this.addValidationError(key, messages[key]);
	            }
	        }
	        this.showAlert('Warning!', 'Validation errors please try again.', 'alert-warning');
	    },
	
	    addValidationError: function (field, message) {
	        var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent() : $('#' + field).parent().parent().parent();
	        controlGroup.addClass('error');
	        $('.help-block', controlGroup).html(message);
	    },
	
	    removeValidationError: function (field, message) {
	        var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent() : $('#' + field).parent().parent().parent();
	        controlGroup.removeClass('error');
	        $('.help-block', controlGroup).html(message ? message : 'Completed successfully.');
	    },
	
	    showAlert: function (title, text, klass) {
	        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
	        $('.alert').addClass(klass);
	        $('.alert .message').html('<strong>' + title + '</strong> ' + text);
	        $('.alert').show();
	        var fadeOut = setTimeout("$('.alert').fadeOut('slow');", 3000);
	        $(".alert").click(function () {
	            clearTimeout(fadeOut);
	            $("#message-icon").toggleClass("icon-lock");
	        });
	        /*$(".alert").bind('click hover', function () {
	        clearTimeout(fadeOut);
	        $("#message-icon").attr('class', 'icon-lock');
	        $("#message-icon").toggle('icon-lock');
	    });*/
	    },
	
	    hideAlert: function () {
	        $('.alert').hide();
	    },
	
	    gridLoader: function () {
	        $('#loader').css('display', 'inline-block');
	        var min = 50;
	        var max = 100;
	        var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        $('.bar').css('width', random + '%');
	        setTimeout("$('#loader').css('display','none');", 300);
	    },
	
	    formLoader: function () {
	        setTimeout("$('#user-form-modal').modal('hide');", 300);
	        $('#loading').css('display', 'inline-block');
	        var min = 50;
	        var max = 100;
	        var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        $('.bar').css('width', random + '%');
	        setTimeout("$('#loading').css('display','none');", 300);
	    }
    
	};

    return utils;

});
define('Router', [
    'jquery',
    'underscore',
    'bootstrap',
    'utils',
    'backbone',
    'HeaderView',
    'UserListCollection',
    'UserListView',
    'UserAddView',
    'UserEditView',
    'UserAdd',
    'User',
    'UserModalView',
    'UserReviewView',
    'ProfilerView'
], function ($, _, bootstrap, utils, Backbone, HeaderView, UserListCollection, UserListView, UserAddView, UserEditView, UserAdd, User, UserModalView, UserReviewView, ProfilerView) {

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
            this.headerView.render();
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
                    utils.gridLoader();
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
                    utils.gridLoader();
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
                    utils.gridLoader();
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
                    utils.gridLoader();
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

    return AppRouter;
});
define('EmailCheck', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var EmailCheck = Backbone.Model.extend({
        urlRoot: "index/email/email",
        idAttribute: "email"
    });

    return EmailCheck;

});
define('NameCheck', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var NameCheck = Backbone.Model.extend({
        urlRoot: "index/username/username",
        idAttribute: "username"
    });

    return NameCheck;

});
define('User', [
    'jquery',
    'underscore',
    'utils',
    'backbone'
], function ($, _, utils, Backbone) {

    var User = Backbone.Model.extend({
        urlRoot: "index/edit/id",
        idAttribute: "id",

        initialize: function () {
            this.validators = {};
            this.validators.username = function (value) {
                if (value.length === 0) {
                    return {
                        isValid: false,
                        message: 'You must choose a username.'
                    };
                }
                if (!utils.stringRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'You must enter a valid username!'
                    };
                }
                return {
                    isValid: true,
                    message: 'Everything looks good!'
                };
            };

            this.validators.fullname = function (value) {
                if (value.length === 0) {
                    return {
                        isValid: false,
                        message: 'You must enter your full name.'
                    };
                }
                return {
                    isValid: true,
                    message: 'Completed successfully!'
                };
            };

            this.validators.email = function (value) {
                if (value.length === 0) {
                    return {
                        isValid: false,
                        message: 'You must enter an email address!'
                    };
                }
                if (!utils.emailRegex.test(value)) {
                    return {
                        isValid: false,
                        message: 'You must enter a valid email address!'
                    };
                }
                return {
                    isValid: true,
                    message: 'Completed successfully!'
                };
            };

            this.validators.identity = function (value) {
                return value === "-1" ? {
                    isValid: false,
                    message: "You must select a user identity level."
                } : {
                    isValid: true
                };
            };

            this.validators.validated = function (value) {
                return value === "-1" ? {
                    isValid: false,
                    message: "You must select if user has been validated."
                } : {
                    isValid: true
                };
            };
        },

        validateItem: function (key) {
            return (this.validators[key]) ? this.validators[key](this.get(key)) : {
                isValid: true
            };
        },

        validateAll: function () {

            var messages = {};

            for (var key in this.validators) {
                if (this.validators.hasOwnProperty(key)) {
                    var check = this.validators[key](this.get(key));
                    if (check.isValid === false) {
                        messages[key] = check.message;
                    }
                }
            }

            return _.size(messages) > 0 ? {
                isValid: false,
                messages: messages
            } : {
                isValid: true
            };
        },

        defaults: {
            id: "",
            username: "",
            fullname: "",
            password: "",
            email: "",
            identity: "-1",
            verified: "-1",
            created: "",
            updated: ""
        }
    });

    return User;

});
define('UserAdd', [
    'jquery',
    'underscore',
    'backbone',
    'User'
], function ($, _, Backbone, User) {

    var UserAdd = User.extend({
        urlRoot: "index/add",
        defaults: {
            username: "",
            fullname: "",
            password: "",
            email: "",
            identity: "-1",
            verified: "-1",
            created: "",
            updated: ""
        }
    });

    return UserAdd;

});
define('UserDelete', [
    'jquery',
    'underscore',
    'backbone',
    'User'
], function ($, _, Backbone, User) {

    var UserDelete = User.extend({
        urlRoot: "index/delete/id"
    });

    return UserDelete;

});
define('UserList', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var UserList = Backbone.Model.extend({
        urlRoot: "index/list",
        idAttribute: "id",
        defaults: {
            items: {
                id: "",
                username: "",
                fullname: "",
                password: "",
                email: "",
                identity: 0,
                verified: 0,
                created: "",
                updated: ""
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

    return UserList;
});
define('UserListCollection', [
    'jquery',
    'underscore',
    'backbone',
    'UserList'
], function ($, _, Backbone, UserList) {

    var UserListCollection = Backbone.Collection.extend({

        model: UserList,

        url: "index/list",

        parse: function (response) {
            this.pages = response.pages;
            this.profiler = response.profiler;
            return response.items;
        },

        getPages: function () {
            return this.pages;
        },

        getCurrentPage: function () {
            return this.pages.current;
        }
    });

    return UserListCollection;
});
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
define('UserAddView', [
    'jquery',
    'underscore',
    'utils',
    'backbone',
    'NameCheck',
    'EmailCheck'], function ($, _, utils, Backbone, NameCheck, EmailCheck) {

    var UserAddView = Backbone.View.extend({

        initialize: function (options) {
            this.template = _.template($("#UserAddView").html());
            this.render();
        },

        events: {
            "change": "change",
            "blur input[id='username']": "checkUsername",
            "blur input[id='email']": "checkEmail",
            "click #submit": "beforeSave"
        },

        checkUsername: function (event) {
            var target = event.target;
            var nameCheck = new NameCheck();
            nameCheck.set({
                username: target.value
            });
            nameCheck.fetch({
                success: function (resp) {
                    var check = resp.attributes;
                    if (check.isValid === false) {
                        utils.addValidationError(target.id, check.message);
                    } else if (!utils.stringRegex.test(target.value)) {
                        utils.addValidationError(target.id, 'You must enter a valid username.');
                    } else {
                        utils.removeValidationError(target.id, check.message);
                    }
                }
            });
        },

        checkEmail: function (event) {
            var target = event.target;
            var emailCheck = new EmailCheck();
            emailCheck.set({
                email: target.value
            });
            emailCheck.fetch({
                success: function (resp) {
                    var check = resp.attributes;
                    if (check.isValid === false) {
                        utils.addValidationError(target.id, check.message);
                    } else if (!utils.emailRegex.test(target.value)) {
                        utils.addValidationError(target.id, 'You must enter a valid email address.');
                    } else {
                        utils.removeValidationError(target.id, check.message);
                    }
                }
            });
        },

        change: function (event) {
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

        beforeSave: function () {
            var check = this.model.validateAll();
            if (check.isValid === false) {
                utils.displayValidationErrors(check.messages);
                return false;
            }
            this.addUser();
            return false;
        },

        addUser: function () {
            $("#user-form-modal").modal('hide');
            var page = 1;
            this.model.save(null, {
                success: function (response) {
                    Backbone.history.navigate('#index/page/' + page, true);
                    utils.showAlert('Success!', 'Customer saved successfully!', 'alert-success');
                },
                error: function () {
                    utils.showAlert('Error', 'An error occurred saving this customer.', 'alert-error');
                }
            });
        }
    });

    return UserAddView;

});
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
define('UserListView', [
    'jquery',
    'jqueryui',
    'utils',
    'underscore',
    'backbone',
    'PaginatorView',
    'ProfilerView',
    'UserDelete'], function ($, ui, utils, _, Backbone, PaginatorView, ProfilerView, UserDelete) {

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