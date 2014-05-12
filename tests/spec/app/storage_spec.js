describe('App.Storage', function(){
	beforeEach(function(){
		this.storage = App.Storage.getInstance();
		this.storage.add("clients", {_id: 1});
		this.storage.add("service_requests", [{_id: 1, client_id: 1}, {_id: 2, client_id: 1}]);
	});

	afterEach(function(){
		this.storage.remove("clients", 1);
		this.storage.remove("service_requests", 1);
		this.storage.remove("service_requests", 2);
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
			this.storage.getSubCollection('service_requests', {client_id: 1}, {fetch: false});
			expect(Giraffe.Collection.prototype.fetch).not.toHaveBeenCalled();
		});

		it("should call the 'fetch()' method on the collection", function(){
			spyOn(Giraffe.Collection.prototype, 'fetch');
			this.storage.getSubCollection('service_requests', {client_id: 1});
			expect(Giraffe.Collection.prototype.fetch).toHaveBeenCalled();
		});

		it("should return a collection form from the models on the main collection", function(){
			var col = this.storage.getSubCollection('service_requests', {client_id: 1}, {fetch: false}); 
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