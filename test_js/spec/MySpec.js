describe("Customer", function() {
  var customer;
  var customerAdd;
  var customerList;

  beforeEach(function() {
    customer = new Customer();
    customerAdd = new CustomerAdd();
    customerAdd.urlRoot = "http://bbcrud.dev/index/add";
    customerList = new CustomerList();
  });
  
  it('customer id should return undefined', function() {
      expect(customerAdd.get("customer_id")).toBeUndefined();
  });

  it("should be able to add a record to the database", function() {
    customerAdd.set(customerAddData);
    customerAdd.save();
  });
  
  describe("customer data should be saved to the database", function () {
    it("customer identification should be accessible", function() {
        var customerId = customerAdd.get("customer_id");
        expect(customerAdd.get("customer_id")).toEqual(customerId);
    });
    
    describe("customer validation tests", function () {
    	
        it("returns true for valid customer email address", function () {
            expect(customerAdd.validateItem(customerAdd.get("email"))).toBeTruthy();
        });
        
      });
    
  });
  
});