define(['User'], function (User) {

    describe('View :: Count Remaining Items', function () {

        beforeEach(function () {
            user = new User();
        });

        it('should be empty', function () {
            expect(user.get("username")).toEqual("");
        });

        it('should not be empty', function () {
            user.set({
                username: 'Tom Shaw'
            });
            expect(user.get("username")).toEqual("Tom Shaw");
        });

    });

});