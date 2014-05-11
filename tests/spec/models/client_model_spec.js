describe("App.Models.Client", function(){
	it("should create the 'phones' and 'addresses' collection on initialize", function(){
		var m = new App.Models.Client();
		expect(m.phones).not.toBe(undefined);
		expect(m.addresses).not.toBe(undefined);
		m.dispose();
	});

	it("should set the 'phones' and 'addresses' values on initialize", function(){
		var phones = [ { number: 1}, { number: 2 }, { number: 3 } ];
		var addresses = [
			{
				street: "Street 123",
				city: "Test",
				department: "Test"
			},
			{
				street: "Street 124",
				city: "Test",
				department: "Test"
			}
		];
		var m = new App.Models.Client({
			phones: phones,
			addresses: addresses, 
		});
		expect(m.phones.length).toEqual(3);
		expect(m.addresses.length).toEqual(2);
		expect(m.get('phones')).toEqual(phones);
		expect(m.get('addresses')).toEqual(addresses);
	});
});