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
});