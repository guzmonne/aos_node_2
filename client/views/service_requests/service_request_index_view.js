App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "row",
	name     : "Ordenes de Servicio",
	
	tableEl        : '#service_requests-table',
	tableCollection: App.Collections.ServiceRequests,
	modelView      : App.Views.ServiceRequestRowView,

	appStorage: 'serviceRequests',

	appEvents: {
		"service_request:create:success": 'checkCreatedModel', 
	},

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	comparator: function(view){
		return (
				view instanceof App.Views.PortletView &&
				view.viewName === "ServiceRequestNewView" &&
				App.defined(view.view) &&
				App.defined(view.view.model) &&
				view.view.model.get('client_id') === this.parent.model.id
			);
	},

	newServiceRequest: function(){
		if(!this.parent.model || !(this.parent.model instanceof App.Models.Client)){
			Backbone.history.navigate('render/service_request/new', {trigger: true});
			return;
		}
		var targetView = app.Renderer.viewIsRendered(this.comparator, this);
		if (targetView){
			return App.scrollTo(targetView.el);
		}
		var parentModel = this.parent.model;
		var object = {
			client_name: parentModel.get('name'),
			client_id  : parentModel.id,
		};
		var model = new App.Models.ServiceRequest(object);
		var portletView = new App.Views.PortletView({
			viewName: 'ServiceRequestNewView',
			viewModel: model,
		});
		app.Renderer.appendToContent(portletView);
		App.scrollTo(portletView.el);
	},

	checkCreatedModel: function(model){
		if (this.collection === app.serviceRequests){ return; }
		if (
			App.defined(this.parent)												&&
			App.defined(this.parent.model)									&&
			this.parent.model instanceof App.Models.Client	&&
			this.parent.model.id === model.get('client_id')
		){
			this.collection.add(model);
		}
	},
});