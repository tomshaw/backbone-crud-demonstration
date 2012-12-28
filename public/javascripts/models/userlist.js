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