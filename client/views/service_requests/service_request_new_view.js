App.Views.ServiceRequestNewView = App.Views.NewView.extend({
	className: "row",
	formViewName: "ServiceRequestFormView",

	initialize: function(){
		this.listenTo(this.model, 'change:client_name', function(){ this.invoke('setHeader'); });
	},
	
	name: function(){
		var clientName, result = "Nueva Orden de Servicio";
		if (!this.model){return result;}
		clientName = this.model.get('client_name');
		if(App.defined(clientName)){
			return "Nueva Orden de Servicio para " + clientName;
		} else {
			return result;
		}
	},
});