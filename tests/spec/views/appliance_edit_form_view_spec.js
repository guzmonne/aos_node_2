describe("App.Views.ApplianceEditFormView", function(){
	beforeEach(function(){
		this.view = new App.Views.ApplianceEditFormView({
			model : new App.Models.Appliance({
				model_id: 1,
				client_id: 1,
				service_request_id: 1, 
				status: "Recibido",
				repairement_type: "Garantía",
			})
		});
	});

	afterEach(function(){
		this.view.model.dispose();
		this.view.dispose();
	});

	
});