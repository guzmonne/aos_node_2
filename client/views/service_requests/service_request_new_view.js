App.Views.ServiceRequestNewView = App.Views.NewView.extend({
	className: "row",
	formViewName: "ServiceRequestFormView",

	initialize: function(){
		this.listenTo(this.model, 'change:client_name', function(){
			this.invoke('setHeader');
		});
	},
	
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
});