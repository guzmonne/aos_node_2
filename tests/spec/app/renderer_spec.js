describe("App.Views.Renderer", function(){
	describe("showView(doc, id)", function(){
		it("should throw an error if the 'doc' is not defined on the viewTree", function(){
			expect(function(){app.Renderer.showView("error", 2);}).toThrowError('Invalid doc: "error" on showView');
		});

		it("should throw an error if no 'id' is passed", function(){
			expect(function(){app.Renderer.showView("client");}).toThrowError('No "id" was passed');
		});

		it("should call the 'showOrGoTo()' method with the params taken from the 'viewTree'", function(){
			var object = {
				storage          : "clients",
				model            : "Client",
				viewName         : "ClientShowView",
				portletFrameClass: "green",
				viewType         : "show",
				options          : {
					_id: 1
				}
			};
			spyOn(app.Renderer, 'showOrGoTo');
			app.Renderer.showView("client", 1);
			expect(app.Renderer.showOrGoTo).toHaveBeenCalledWith(object, app.Renderer.showComparator);		
		});
	});

	describe("docView(doc, type)", function(){
		it("should throw an error if the 'doc' is not defined on the viewTree", function(){
			expect(function(){app.Renderer.docView("error", "index");}).toThrowError('Invalid doc: "error" on showView');
		});

		it("should throw an error if no 'type' is passed", function(){
			expect(function(){app.Renderer.docView("client");}).toThrowError('No "type" was passed');
		});

		it("should call the 'showOrGoTo()' method with the params taken from the 'viewTree'", function(){
			var object1 = {
				storage          : "clients",
				model            : "Client",
				viewName         : "ClientIndexView",
				viewType         : "index",
				collection       : true,
			};
			var object2 = {
				storage          : "clients",
				model            : "Client",
				viewName         : "ClientNewView",
				viewType         : "new",
			};
			spyOn(app.Renderer, 'showOrGoTo');
			app.Renderer.docView("client", "index");
			expect(app.Renderer.showOrGoTo).toHaveBeenCalledWith(object1);		
			app.Renderer.docView("client", "new");
			expect(app.Renderer.showOrGoTo).toHaveBeenCalledWith(object2);		
		});
	});

	describe('showOrGoTo(params, comparator)', function(){
		it("should throw an error if 'params' is not defined", function(){
			expect(function(){app.Renderer.showOrGoTo();}).toThrowError('"params" must be defined');
		});

		it("should throw an error if 'params.viewName' is not defined", function(){
			expect(function(){app.Renderer.showOrGoTo({});}).toThrowError('"params.viewName" must be defined');
		});

		it("should throw an error if the view to be call is not defined", function(){
			expect(function(){app.Renderer.showOrGoTo({viewName: "ErrorView"});}).toThrowError('View "App.Views.ErrorView" is not defined');
		});
	});

	describe("show(params)", function(){
		it("should throw an error if 'params' is not defined", function(){
			expect(function(){app.Renderer.show();}).toThrowError('"params" must be defined');
		});
	});
});