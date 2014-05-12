describe("App", function() {
  describe("isObjectsArray", function(){
    beforeEach(function(){
      this.error1  = "test";
      this.error2  = ["test", "test"];
      this.error3  = [ {}, "test", "test" ];
      this.success = [{}, {}, {}];
    });

    it("should return false if the value is not an object's array", function(){
      expect(App.isObjectsArray(this.error1)).toBe(false);
      expect(App.isObjectsArray(this.error2)).toBe(false);
      expect(App.isObjectsArray(this.error3)).toBe(false);
    });

    it("should return true if the value is an object's array", function(){
      expect(App.isObjectsArray(this.success)).toBe(true);
    });
  });
});

describe("App.Models.BaseModel", function() {
  var model;

  beforeEach(function() {
    model = new App.Models.BaseModel();
  });

  it("should call its awake method on initialize", function(){
    spyOn(App.Models.BaseModel.prototype, 'awake');
    var m = new App.Models.BaseModel();
    expect(App.Models.BaseModel.prototype.awake).toHaveBeenCalled();
    m.dispose();
  });

  it("should have an array attribute called children", function() {
    expect(model.children).toEqual([]);
  });

  describe('createChilds()', function(){
    beforeEach(function(){
      this.TestModel = App.Models.BaseModel.extend({
        childs: [
          {
            attribute: 'attribute1',
            type     : 'model',
            name     : 'BaseModel'    
          },
          {
            attribute: 'attribute2',
            type     : 'collection',
            name     : 'BaseCollection'    
          }
        ],
      });
      this.ErrorTestModel1 = App.Models.BaseModel.extend({
        childs: "test",
      });
      this.ErrorTestModel2 = App.Models.BaseModel.extend({
        childs: [1, 2, 4],
      });
      this.ErrorTestModel3 = App.Models.BaseModel.extend({
        childs: [
          {
            type     : 'Model',
            name     : 'Attribute1'    
          },
        ],
      });
      this.ErrorTestModel4 = App.Models.BaseModel.extend({
        childs: [
          {
            attribute: 'attribute',
            type     : 'error',
            name     : 'BaseModel'    
          },
        ],
      });
      this.test = new this.TestModel();
    });

    afterEach(function(){
      this.test.dispose();
      this.test = null;
    });

    it("should call the createChilds function if the objects 'childs' its found", function(){
      spyOn(App.Models.BaseModel.prototype, 'createChilds');
      var m1 = new App.Models.BaseModel();
      expect(App.Models.BaseModel.prototype.createChilds).not.toHaveBeenCalled();
      var m2 = new this.TestModel();
      expect(App.Models.BaseModel.prototype.createChilds).toHaveBeenCalled();
      m1.dispose();
      m2.dispose();
    });

    it("should throw an error if 'childs' is not an array", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel1();}).toThrowError();
    });

    it("should throw an error if 'childs' is not an objects array", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel2();}).toThrowError();
    });

    it("should check for the type of the childs to be correct", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel4();}).toThrowError();
    });

    it("should throw an error if a 'child' doesn't have an 'attribute', 'type', or 'name' key", function(){
      var self = this;
      expect(function(){new self.TestModel();}).not.toThrowError();
      expect(function(){new self.ErrorTestModel3();}).toThrowError();
    });

    it("should add the childs objects to the children array", function(){
      expect(this.test.children.length).toEqual(2);
    });

    it("should create references to the childs", function(){
      expect(this.test.attribute1).not.toBe(undefined);
      expect(this.test.attribute2).not.toBe(undefined);
    });

    it("should set this model as the parent of the childs", function(){
      expect(this.test.attribute1.parent).not.toBe(undefined);
      expect(this.test.attribute2.parent).not.toBe(undefined);
      expect(this.test.attribute1.parent).toEqual(this.test);
      expect(this.test.attribute2.parent).toEqual(this.test);
    });

    it("should make the childs changes trigger a change event on its parent", function(){
      var m = new App.Models.BaseModel();
      fun1 = jasmine.createSpy();
      fun2 = jasmine.createSpy();
      fun3 = jasmine.createSpy();
      m.listenTo(this.test, 'change:attribute1', fun1);
      m.listenTo(this.test, 'change:attribute2', fun2);
      expect(fun1).not.toHaveBeenCalled();
      this.test.attribute1.set('foo', 'bar');
      expect(fun1).toHaveBeenCalled();
      expect(fun2).not.toHaveBeenCalled();
      this.test.attribute2.add({foo: 'bar'});
      expect(fun2).toHaveBeenCalled();
      m.listenTo(this.test, 'change:attribute2', fun3);
      this.test.attribute2.remove(this.test.attribute2.models[0]);
      expect(fun3).toHaveBeenCalled();
      m.dispose();
    });

    it("should call the childs dispose method upon parent dispose", function(){
      var m = new this.TestModel();
      var t = new this.TestModel();
      var spy1 = jasmine.createSpy();
      var spy2 = jasmine.createSpy();
      t.listenTo(m.attribute1, 'disposed', spy1);
      t.listenTo(m.attribute2, 'disposed', spy2);
      m.dispose();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it("should set the values on initialize", function(){
      var m = new this.TestModel({
        attribute1: {
          foo: "bar"
        },
        attribute2: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          }
        ]
      });
      expect(m.attribute1.get('foo')).toEqual('bar');
      expect(m.attribute2.length).toEqual(2);
      m.dispose();
    });
  });

  describe("parse()", function(){
    beforeEach(function(){
      this.TestModel = App.Models.BaseModel.extend({
        url: '/example',
        childs: [
          {
            attribute: 'attribute1',
            type     : 'model',
            name     : 'BaseModel'    
          },
          {
            attribute: 'attribute2',
            type     : 'collection',
            name     : 'BaseCollection'    
          }
        ],
      });
      var MOCK_GET_DATA = {
        attribute1: {
          foo: "bar"
        },
        attribute2: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          }
        ]
      };
      this.test = new this.TestModel();
      spyOn($, 'ajax').and.callFake(function(options){
        options.success(MOCK_GET_DATA);
      });
    });

    it("should fill the child data if defined on the response", function(){
      expect(this.test.attribute1.get('foo')).toEqual(undefined);
      expect(this.test.attribute2.length).toEqual(0);
      this.test.fetch();
      expect(this.test.attribute1.get('foo')).toEqual('bar');
      expect(this.test.attribute2.length).toEqual(2);
    });
  });
});

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
describe("App.Views.TableView", function(){
	beforeEach(function(){
		this.view = new App.Views.TableView({
			tableEl: '#testTable',
			collection: new App.Collections.BaseCollection(),
		});
		var MOCK_GET_DATA = [
			{foo: 1},
			{bar: 2}
		];
		spyOn($, 'ajax').and.callFake(function(options){
      options.success(MOCK_GET_DATA);
    });
		$('#page-wrapper').append('<div id="testTable"></div>');
	});

	afterEach(function(){
		this.view.dispose();
		this.view = undefined;
		$('#page-wrapper').empty();
	});

	describe("constructor()", function(){
		it("should set 'view.synced' to true if the options is passed, else set it to false", function(){
			expect(this.view.synced).toBe(false);
			var v = new App.Views.TableView({
				collection: new App.Collections.BaseCollection(),
				synced    : true,
			});
			expect(v.synced).toBe(true);
			v.dispose();
		});

		it("should set 'view.rendered' value to false", function(){
			expect(this.view.rendered).toBe(false);
		});
	});

	describe("render() and afterRender()", function(){
		it("should set the 'view.rendered' value to true", function(){
			this.view.render();
			expect(this.view.rendered).toBe(true);
		});

		it("should call 'appendCollection()' in 'afterRender()' if 'view.synced' equals true", function(){
			this.view.synced = true;
			expect(this.view.synced).toBe(true);
			spyOn(this.view, 'appendCollection');
			this.view.afterRender();
			expect(this.view.appendCollection).toHaveBeenCalled();
		});

		it("should not call 'appendCollection()' in 'afterRender()' if 'view.synced' equals false", function(){
			expect(this.view.synced).toBe(false);
			spyOn(this.view, 'appendCollection');
			this.view.render();
			expect(this.view.appendCollection).not.toHaveBeenCalled();
		});	

		it("should not call 'appendCollection()' in 'afterRender()' if 'view.rendered' equals true", function(){
			this.view.rendered = true;
			this.view.synced   = true;
			expect(this.view.rendered).toBe(true);
			expect(this.view.synced).toBe(true);
			spyOn(this.view, 'appendCollection');
			this.view.tableFetched();
			expect(this.view.appendCollection).not.toHaveBeenCalled();
		});
	});

	describe("collection:sync event, tableFetched()", function(){
		it("should set the 'view.synced' value to true", function(){
			expect(this.view.synced).toBe(false);
			this.view.tableFetched();
			expect(this.view.synced).toBe(true);
		});

		it("should not call 'appendCollection()' after 'sync' if 'view.rendered' equals false", function(){
			expect(this.view.rendered).toBe(false);
			spyOn(this.view, 'appendCollection');
			this.view.tableFetched();
			expect(this.view.appendCollection).not.toHaveBeenCalled();
		});

		it("should call 'appendCollection()' after 'sync' if 'view.rendered' equals true", function(){
			this.view.rendered = true;
			expect(this.view.rendered).toBe(true);
			spyOn(this.view, 'appendCollection');
			this.view.tableFetched();
			expect(this.view.appendCollection).toHaveBeenCalled();
		});

		it("should not call 'appendCollection()' if 'view.rendered' and 'view.synced' is true", function(){
			this.view.rendered = true;
			this.view.synced   = true;
			expect(this.view.rendered).toBe(true);
			expect(this.view.synced).toBe(true);
			spyOn(this.view, 'appendCollection');
			this.view.tableFetched();
			expect(this.view.appendCollection).not.toHaveBeenCalled();
		});
	});

	describe("appendCollection()", function(){
		beforeEach(function(){
			this.view.collection.set([
				{foo: 1},
				{foo: 2}
			]);
			this.view.template = function(){
				return '<table><tbody></tbody>tbody></table>';
			};
			this.view.modelView = App.Views.RowView.extend({
				template: function(attrs){
					var foo = (attrs.foo) ? attrs.foo : 'bar';
					return '<td>'+ foo + '</td>'
				},
			})
			this.view.render();
		});

		it("should create a tbody element to store the rows", function(){
			this.view.appendCollection();
			expect(this.view.tbody instanceof jQuery).toBe(true);
		});

		it("should append all the row views on the tbody fragment", function(){
			this.view.appendCollection();
			expect(this.view.tbody.find('td').length).toEqual(2);
		});

		it("should append the tbody to the view", function(){
			this.view.appendCollection();
			expect(this.view.$('tbody').length).toEqual(1);
		});
	});
});
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
	
	describe("Form", function(){
		describe("toggleButtons()", function(){
			beforeEach(function(){
				this.v = new App.Views.ClientFormView({
					model : new App.Models.Client({_id: 123}),
				});
				this.v.render();
			});

			afterEach(function(){
				this.v.dispose();
				this.v = undefined;
			});

			it("should toggle the edit and update buttons", function(){
				expect(this.v.model.isNew()).toBe(false);
				expect(this.v.$('#update-form').hasClass('hide')).toBe(true);
				expect(this.v.$('#edit-form').hasClass('hide')).toBe(false);
				this.v.toggleButtons();
				expect(this.v.$('#update-form').hasClass('hide')).toBe(false);
				expect(this.v.$('#edit-form').hasClass('hide')).toBe(true);
				this.v.dispose();
			});
			
			it("should call the 'unblockForm()' method", function(){
				spyOn(this.v, 'unblockForm');
				expect(this.v.$('#update-form').hasClass('hide')).toBe(true);
				this.v.toggleButtons();
				expect(this.v.$('#update-form').hasClass('hide')).toBe(false);
				expect(this.v.unblockForm).toHaveBeenCalled();
			});
		});

	});
});
describe("App.Views.ClientShowView", function(){
	beforeEach(function(){
		this.view = new App.Views.ClientShowView({
			model: new App.Models.Client({
				_id : '1',
				name: 'foo',
			})
		});
		var MOCK_GET_DATA = [
			{
				_id: 1,
			},
			{
				_id: 2
			}
		];
		spyOn($, 'ajax').and.callFake(function(options){
			options.success(MOCK_GET_DATA);
		});
		$('#page-wrapper').append('<div id="client-service_requests-'+this.view.timestamp+'"></div>');
	});

	afterEach(function(){
		this.view.dispose();
		this.view = undefined;
		$('#page-wrapper').empty();
	});

	describe("renderServiceRequests()", function(){
		it("should do nothing if 'serviceRequests' is defined on the view", function(){
			this.view.serviceRequests = "foo";
			this.view.renderServiceRequests();
			expect(this.view.serviceRequests).toEqual("foo");
		});

		it("should create a new 'ServiceRequestIndex' view with a 'Service Requests Collection'", function(){
			spyOn(App.Views.ServiceRequestIndexView.prototype, 'initialize').and.callThrough();
			spyOn(App.Collections.ServiceRequests.prototype, 'initialize').and.callThrough();
			this.view.renderServiceRequests();
			expect(App.Views.ServiceRequestIndexView.prototype.initialize).toHaveBeenCalled();
			expect(App.Collections.ServiceRequests.prototype.initialize).toHaveBeenCalled();
		});

		it("should pass the 'client_id' into the 'ServiceRequestIndex' collection", function(){
			this.view.renderServiceRequests();
			expect(this.view.serviceRequests.collection.client_id).toEqual('1');
		});

		it("should fetch the collection data and attach the view on 'success'", function(){
			spyOn(App.Views.ServiceRequestIndexView.prototype, 'attachTo');
			spyOn(App.Collections.ServiceRequests.prototype, 'fetch').and.callThrough();
			this.view.renderServiceRequests();
			expect(App.Collections.ServiceRequests.prototype.fetch).toHaveBeenCalled();
			expect(App.Views.ServiceRequestIndexView.prototype.attachTo).toHaveBeenCalled();
		});
	});
});