describe("App.Views.TableView", function(){
	beforeEach(function(){
		this.view = new App.Views.TableView({
			collection : new App.Collections.BaseCollection(),
		});
	});

	afterEach(function(){
		this.view.dispose();
		this.view = undefined;
	});

	describe("activateTable", function(){
		it("should do nothing if 'oTable' is defined", function(){
			this.view.oTable = "foo";
			this.view.activateTable();
			expect(this.view.oTable).toEqual("foo");
		});

		it("should create the event handler for the 'add' event on the collection", function(){
			spyOn(this.view, 'append');
			this.view.collection.add({foo: 'bae'});
			expect(this.view.append).not.toHaveBeenCalled();
			this.view.activateTable();
			this.view.collection.add({foo: 'bar'});
			expect(this.view.append).toHaveBeenCalled();
		});
	});
});