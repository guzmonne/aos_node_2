App.Views.ServiceRequestNewView = App.Views.BaseView.extend({
	name: "Nueva Orden de Servicio",

	className: "row",

	afterRender: function(){
		this.renderForm();
		var clientName = this.model.get('client_name');
		var clientID   = this.model.get('client_id');
		if(App.defined(clientName) && App.defined(clientID)){
			this.name = "Nueva Orden de Servicio para " + clientName + " #" + clientID;
			this.parent.setHeader();
		}
	},

	renderForm: function(){
		var model;
		if(App.defined(this.model)){
			model = this.model;
		} else {
			model = new App.Models.ServiceRequest();
		}
		this.serviceRequestForm = new App.Views.ServiceRequestFormView({
			model: model
		});
		this.serviceRequestForm.attachTo(this.$el, {method: 'html'});
	},
});