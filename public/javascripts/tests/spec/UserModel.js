define([ 'UserData', 'User' ], function(mockData, User) {

	describe('User Model :: Basic Operations', function() {

		beforeEach(function() {
			user = new User();
			user.set(mockData);
		});

		it("should expose fullname attribute", function() {
			expect(user.get("fullname")).toEqual("Tom Shaw");
		});
		
		it("should expose id attribute", function() {
			expect(user.get('id')).toEqual(jasmine.any(Number));
		});

	});

});