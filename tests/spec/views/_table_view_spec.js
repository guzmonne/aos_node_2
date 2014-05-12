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
					return '<td>'+ foo + '</td>';
				},
			});
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