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