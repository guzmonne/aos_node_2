App.Views.ServiceRequestNewView = App.Views.BaseView.extend({
	className: "row",
	
	name: function(){
		var clientName, clientID;
		var result = "Nueva Orden de Servicio";
		if (!App.defined(this.model)){return result;}
		clientName = this.model.get('client_name');
		clientID   = this.model.get('client_id');
		if(App.defined(clientName) && App.defined(clientID)){
			return "Nueva Orden de Servicio para " + clientName;
		} else {
			return result;
		}
	},

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.ServiceRequest();
		}
	},

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.serviceRequestForm = new App.Views.ServiceRequestFormView({
			model: this.model
		});
		this.serviceRequestForm.attachTo(this.$el, {method: 'html'});
		this.listenTo(this.serviceRequestForm.model, 'change:client_name', this.updateName);
	},

	updateName: function(){
		if(this.parent){
			this.parent.setHeader(this.name());
		}
	},
});