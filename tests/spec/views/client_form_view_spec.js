describe("App.Views.ClientFormView", function(){
	beforeEach(function(){
		this.view = new App.Views.ClientFormView({
			model: new App.Models.Client()
		});
		this.view.render();
	});

	afterEach(function(){
		this.view.dispose();
		this.view = undefined;
	});

	describe("Model", function(){
		beforeEach(function(){
			var MOCK_POST_DATA = {
				'_id'       : 1,
				'name'      : 'foo',
				'doc-type'  : 'CI',
				'doc-number': 123,
				'email'     : 'foo@bar.com',
				'phones': [
					{
						_id   : 1,
						number: 12345
					},
					{
						_id   : 2,
						number: 54321
					}
				],
				'addresses': [
					{
						'street'    : 'foo1',
						'city'      : 'bar1',
						'department': 'foobar1'
					},
					{
						'street'    : 'foo2',
						'city'      : 'bar2',
						'department': 'foobar2'
					},
				]
			};
			spyOn($, 'ajax').and.callFake(function(options){
        options.success(MOCK_POST_DATA);
      });
		});

		describe("setModel()", function(){
			it("should set the model attributes taken from the form", function(){
				this.view.$('[name=name]').val('foo');
				this.view.$('[name=doc-type]').val('CI');
				this.view.$('[name=doc-number]').val('1');
				this.view.$('[name=email]').val('foo@bar.com');
				this.view.setModel();
				expect(this.view.model.get('name')).toEqual('foo');
				expect(this.view.model.get('doc-type')).toEqual('CI');
				expect(this.view.model.get('doc-number')).toEqual('1');
				expect(this.view.model.get('email')).toEqual('foo@bar.com');
			});

			it("should call 'addPhone()' if there is a new phone to add", function(){
				spyOn(this.view, 'addPhone').and.callThrough();
				this.view.$('[name=phone]').val('123');
				this.view.setModel();
				expect(this.view.addPhone).toHaveBeenCalled();
				expect(this.view.model.get('phones')[0].number).toEqual('123');
			});

			it("should call 'addAddress()' if there is a new address to add", function(){
				spyOn(this.view, 'addAddress').and.callThrough();
				this.view.$('[name=street]').val('foo');
				this.view.$('[name=city]').val('bar');
				this.view.$('[name=department]').val('foobar');
				this.view.setModel();
				expect(this.view.addAddress).toHaveBeenCalled();
				expect(this.view.model.get('addresses')[0].street).toEqual('foo');
				expect(this.view.model.get('addresses')[0].city).toEqual('bar');
				expect(this.view.model.get('addresses')[0].department).toEqual('foobar');
			});
		});

		describe("createModel()", function(){
			it("should call the 'setModel()' function", function(){
				spyOn(this.view, 'setModel');
				this.view.createModel();
				expect(this.view.setModel).toHaveBeenCalled();
			});

			it("should create a new empty model for the view", function(){
				var cid = this.view.model.cid;
				this.view.createModel();
				expect(this.view.model.cid).not.toEqual(cid);
			});

			it("should empty the form", function(){
				this.view.$('[name=name]').val('foo');
				this.view.createModel();
				expect(this.view.$('[name=name]').val()).toEqual('');
			});
		});
	});

	describe("Addresses", function(){
		describe('renderAddresses', function(){
			it("should render the 'addresses' collection when the 'addresses' attribute is changed", function(){
				spyOn(this.view, 'addressFieldTemplate').and.callThrough();
				this.view.model.addresses.add({street: 'foo', city: 'bar', department: 'foobar'});
				expect(this.view.addressFieldTemplate).toHaveBeenCalled();
				var street     = this.view.$('#addresses [data-source-index=0] > div > [data-name=street]').val();
				var city       = this.view.$('#addresses [data-source-index=0] > div > [data-name=city]').val();
				var department = this.view.$('#addresses [data-source-index=0] > div > [data-name=department]').val();
				expect(street).toEqual('foo');
				expect(city).toEqual('bar');
				expect(department).toEqual('foobar');
			});
		});

		describe('addAddress()', function(){
			it("should do nothing if the 'street' input is empty", function(){
				expect(this.view.model.addresses.length).toBe(0);
				this.view.addAddress();
				expect(this.view.model.addresses.length).toBe(0);
			});

			it("should add the address to the 'addresses' collection", function(){
				expect(this.view.model.addresses.length).toBe(0);
				this.view.$('[name=street]').val('foo');
				this.view.$('[name=city]').val('bar');
				this.view.$('[name=department]').val('foobar');
				this.view.addAddress();
				expect(this.view.model.addresses.length).toBe(1);
			});
		});

		describe('delAddress([index || event])', function(){
			it("should remove the 'address' model from the 'addresses' collection", function(){
				expect(this.view.model.addresses.length).toBe(0);
				this.view.model.addresses.add({street: 'foo', city: 'bar', department: 'foobar'});
				expect(this.view.model.addresses.length).toBe(1);
				this.view.delAddress(0);
				expect(this.view.model.addresses.length).toBe(0);
			});
		});

		describe('editAddress([index || event])', function(){
			it("should set the 'street', 'city', and 'department' input with the address to edit", function(){
				expect(this.view.model.addresses.length).toBe(0);
				this.view.model.addresses.add({street: 'foo', city: 'bar', department: 'foobar'});
				this.view.editAddress(0);
				expect(this.view.$('[name=street]').val()).toEqual("foo");
				expect(this.view.$('[name=city]').val()).toEqual("bar");
				expect(this.view.$('[name=department]').val()).toEqual("foobar");
			});

			it("should remove the to be edited 'phone' from the 'addresses' collection", function(){
				spyOn(this.view, 'delAddress').and.callThrough();
				expect(this.view.model.addresses.length).toBe(0);
				this.view.model.addresses.add({street: 'foo', city: 'bar', department: 'foobar'});
				this.view.editAddress(0);
				expect(this.view.delAddress).toHaveBeenCalled();
				expect(this.view.model.addresses.length).toBe(0);
			});
		});
	});

	describe("Phones", function(){
		describe('renderPhones()', function(){
			it("should render the 'phones' collection when the 'phones' attribute is changed", function(){
				spyOn(this.view, 'phoneFieldTemplate').and.callThrough();
				this.view.model.phones.add({number: 123});
				expect(this.view.phoneFieldTemplate).toHaveBeenCalled();
				expect(this.view.$('[data-source-index=0]').find('input').val()).toEqual('123');
			});
		});

		describe('editPhone([index || event])', function(){
			it("should set the 'phone' input with the phone to edit", function(){
				expect(this.view.model.phones.length).toBe(0);
				this.view.model.phones.add({number: 123});
				this.view.editPhone(0);
				expect(this.view.$('[name=phone]').val()).toEqual("123");
			});

			it("should remove the to be edited 'phone' from the 'phones' collection", function(){
				spyOn(this.view, 'delPhone').and.callThrough();
				expect(this.view.model.phones.length).toBe(0);
				this.view.model.phones.add({number: 123});
				this.view.editPhone(0);
				expect(this.view.delPhone).toHaveBeenCalled();
				expect(this.view.model.phones.length).toBe(0);
			});
		});

		describe('delPhone([index || event])', function(){
			it("should remove the 'phone' model from the 'phones' collection", function(){
				expect(this.view.model.phones.length).toBe(0);
				this.view.model.phones.add({number: 123});
				expect(this.view.model.phones.length).toBe(1);
				this.view.delPhone(0);
				expect(this.view.model.phones.length).toBe(0);
			});
		});

		describe('addPhone()', function(){
			it("should do nothing if the 'phone' input is empty", function(){
				expect(this.view.model.phones.length).toBe(0);
				this.view.addPhone();
				expect(this.view.model.phones.length).toBe(0);
			});

			it("should add the phone number to the 'phones' collection", function(){
				expect(this.view.model.phones.length).toBe(0);
				this.view.$('[name=phone]').val('123');
				this.view.addPhone();
				expect(this.view.model.phones.length).toBe(1);
			});
		});
	});
});