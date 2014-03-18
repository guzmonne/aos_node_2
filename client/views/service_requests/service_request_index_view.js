App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "col-lg-12",
	name     : "Ordenes de Servicio",
	
	tableEl        : '#service_requests-table',
	tableCollection: 'ServiceRequests',
	modelView      : App.Views.ServiceRequestRowView,

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	onSync: function(){
		this.collection.fetch();
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
		app.attach(portletView, {el: '#content-el', method: 'prepend'});
	},
});