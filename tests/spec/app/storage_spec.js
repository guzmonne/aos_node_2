describe('App.Storage', function(){
	beforeEach(function(){
		this.storage = App.Storage.getInstance();
		this.storage.add("clients", {_id: 1});
		this.storage.add("service_requests", [{_id: 1, f1: 1}, {_id: 2, f1: 1}]);
	});

	afterEach(function(){
		this.storage.remove("clients", 1);
		this.storage.remove("service_requests", 1);
		this.storage.remove("service_requests", 2);
	});

	describe("new(collection)", function(){
		it("should return a new model", function(){
			var m = this.storage.newModel("clients");
			expect(m.isNew()).toBe(true);
		});
	});

	describe("setModel(collection, options, context)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.setModel();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.setModel('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should return an existing model fron the collection if 'options._id' is passed", function(){
			var cid = this.storage.get("clients", 1).cid;
			expect(this.storage.setModel("clients", {_id: 1}).cid).toEqual(cid);
		});

		it("should return an existing model from the collection if 'options.attributes._id' is passed", function(){
			var cid = this.storage.get("clients", 1).cid;
			expect(this.storage.setModel("clients", { attributes: {_id: 1} }).cid).toEqual(cid);
		});

		it("should return a new model if no 'options._id' is passed or it does no exists in the collection", function(){
			var m1 = this.storage.setModel("clients");
			var m2 = this.storage.setModel("clients", {_id: 2});
			expect(m1.isNew()).toBe(true);
			expect(m2.hasChanged()).toBe(false);
			this.storage.remove("clients", m1);
			this.storage.remove("clients", m2);
		});

		it("should set the attributes passed on 'options.attributes'", function(){
			var m1 = this.storage.setModel("clients", {attributes: {_id: 2, foo: "bar"}});
			expect(m1.get("foo")).toEqual("bar");
			this.storage.remove("service_requests", m1);
		});
	});

	describe("setSubCollection(collection, objects, options, context)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.setSubCollection();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.setSubCollection('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should return a subCollection of the given collection", function(){
			expect(this.storage.setSubCollection('clients', [
				{_id: 2}, 
				{_id: 3}
			]) instanceof App.Collections.Clients).toBe(true);
			this.storage.remove("clients", 2);
			this.storage.remove("clients", 3);
		});

		it("should return a subCollection with the same amount of models as objects passed", function(){
			var subCol = this.storage.setSubCollection('clients', [
				{_id: 2}, 
				{_id: 3}
			]);
			expect(subCol.length).toEqual(2);
			this.storage.remove("clients", 2);
			this.storage.remove("clients", 3);
		});

		describe("setSubCollection() with options.filter", function(){
			beforeEach(function(){
				this.testCol = this.storage.setSubCollection("service_requests", [
					{_id: 3, f1: 1, f2: 2}, {_id: 4, f1: 1, f2: 2}
				], {filter: {f1: 1, f2: 2}});
			});

			afterEach(function(){
				this.testCol.dispose();
				this.storage.remove("service_requests", 3);
				this.storage.remove("service_requests", 4);
				this.testCol = undefined;
			});

			it("should add an event listener for 'add' events on the main collection and add it if it matches", function(){
				expect(this.testCol.length).toEqual(2);
				this.storage.add('service_requests', {_id: 5, f1:1, f2:2});
				expect(this.testCol.length).toEqual(3);
				this.storage.remove('service_requests', 5);
			});
			
			it("should add an event listener for 'remove' events on the main collection and remove it", function(){
				expect(this.testCol.length).toEqual(2);
				this.storage.remove('service_requests', 3);
				expect(this.testCol.length).toEqual(1);
			});

			it("should add an event listener for every 'client:key' events on the main collection and remove it if it does not match", function(){
				expect(this.testCol.length).toEqual(2);
				this.storage.add('service_requests', {_id: 3, f1: 1, f2: 1});
				expect(this.testCol.length).toEqual(1);
				this.storage.add('service_requests', {_id: 4, f1: 2, f2: 2});
				expect(this.testCol.length).toEqual(0);
			});

			it("should add an event listener for the 'dispose' event on the subCollection to stop listening to events", function(){
				expect(this.testCol.length).toEqual(2);
				this.testCol.dispose();
				this.storage.add("service_requests", {_id: 5, f1: 1, f2:2});
				expect(this.testCol.length).toEqual(0);
				this.storage.remove('service_requests', 5);
			});

			it("should accept a function on the filter array that returns the 'filter' object", function(){
				var m = new App.Models.BaseModel({_id: 1});
				m.clients = this.storage.setSubCollection("clients", [
					{_id: 3, f1: 1, f2: 2}, {_id: 4, f1: 1, f2: 2}
				], {filter: function(){
					return {f1: m.id};
				}});
				expect(m.clients.length).toEqual(2);
				this.storage.remove("clients", 3);
				this.storage.remove("clients", 4);
			});
		});
	});

	describe("add(collection, model || array || object)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.add();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.add('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should call the 'collection's' 'add()' method", function(){
			spyOn(Giraffe.Collection.prototype, 'add');
			this.storage.add("clients", {_id: 2});
			expect(Giraffe.Collection.prototype.add).toHaveBeenCalled();
		});
	});

	describe("get(collection, id || cid || model)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.get();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.get('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should call the 'collection's' 'get()' method", function(){
			spyOn(Giraffe.Collection.prototype, 'get');
			this.storage.get("clients", 2);
			expect(Giraffe.Collection.prototype.get).toHaveBeenCalled();
		});
	});

	describe("remove(collection, id || cid || model)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.remove();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.remove('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should remove the model if its passed to the method", function(){
			var m = this.storage.get("clients", 1);
			this.storage.remove("clients", m);
			expect(this.storage.collection("clients").length).toBe(0);
		});

		it("should call the 'collection's' 'remove()' method", function(){
			spyOn(Giraffe.Collection.prototype, 'remove');
			this.storage.remove("clients", 2);
			expect(Giraffe.Collection.prototype.remove).toHaveBeenCalled();
		});
	});


	describe("getSubCollection(collection, condition, options, context)", function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.getSubCollection();
			})
			.toThrowError('No "collection" was passed');
		});	

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.getSubCollection('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should throw an error if 'condition' object was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.getSubCollection('service_requests');
			})
			.toThrowError('A "condition" must be passed');
		});

		it("should not call fetch if 'options.fetch' equals false", function(){
			spyOn(Giraffe.Collection.prototype, 'fetch');
			this.storage.getSubCollection('service_requests', {f1: 1}, {fetch: false});
			expect(Giraffe.Collection.prototype.fetch).not.toHaveBeenCalled();
		});

		it("should call the 'fetch()' method on the collection", function(){
			spyOn(Giraffe.Collection.prototype, 'fetch');
			this.storage.getSubCollection('service_requests', {f1: 1});
			expect(Giraffe.Collection.prototype.fetch).toHaveBeenCalled();
		});

		it("should return a collection form from the models on the main collection", function(){
			var col = this.storage.getSubCollection('service_requests', {f1: 1}, {fetch: false}); 
			expect(col instanceof Giraffe.Collection).toBe(true);
			expect(col.length).toEqual(2);
		});
	});

	describe('getModel(collection, id, options, context)', function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.getModel();
			})
			.toThrowError('No "collection" was passed');
		});

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.getModel('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should throw an error if an id was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.getModel('clients');
			})
			.toThrowError('An "id must be passed"');
		});

		it("should not call fetch if 'options.fetch' equals false", function(){
			spyOn(Giraffe.Model.prototype, 'fetch');
			this.storage.getModel('clients', function(model){return;}, {fetch: false});
			expect(Giraffe.Model.prototype.fetch).not.toHaveBeenCalled();
		});

		it("should call the 'fetch()' method on the model", function(){
			spyOn(Giraffe.Model.prototype, 'fetch');
			this.storage.getModel('clients', 1);
			expect(Giraffe.Model.prototype.fetch).toHaveBeenCalled();
		});

		it("should return the model from the collection if found", function(){
			expect(this.storage.getModel('clients',1, {fetch: false}) instanceof Giraffe.Model).toBe(true);
		});

		it("should set the model attributes if 'options.attributes' is passed", function(){
			var m = this.storage.getModel('clients', 1, {
				fetch: false,
				attributes: {
					foo: 'bar'
				}
			});
			expect(m.get('foo')).toEqual('bar');
		});
	});

	describe('getCollection(collection, options, context)', function(){
		it("should throw an error if a collection was not passed", function(){
			var self = this;
			expect(function(){
				return self.storage.getCollection();
			})
			.toThrowError('No "collection" was passed');
		});

		it("should throw an error if a collection is not defined", function(){
			var self = this;
			expect(function(){
				return self.storage.getCollection('error');
			})
			.toThrowError('Collection "error" is not defined');
		});

		it("should not call fetch if 'options.fetch' equals false", function(){
			spyOn(Giraffe.Collection.prototype, 'fetch');
			this.storage.getCollection('clients', {fetch: false});
			expect(Giraffe.Collection.prototype.fetch).not.toHaveBeenCalled();
		});

		it("should call the 'fetch()' method on the collection", function(){
			spyOn(Giraffe.Collection.prototype, 'fetch');
			this.storage.getCollection('clients', {});
			expect(Giraffe.Collection.prototype.fetch).toHaveBeenCalled();
		});

		it("should call the 'success' function after fetch", function(done){
			this.testVar = undefined;
			var options = {};
			options.success = function(){
				this.testVar = 1;
				expect(this.testVar).toEqual(1);
				done();
			};
			this.storage.getCollection('clients', options);
		});
	});
});