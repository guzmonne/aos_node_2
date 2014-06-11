App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "row",
	name     : "Ordenes de Servicio",
	
	tableEl  : '#service_requests-table',

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
				{ "className": "text-center", "targets": [0, 2, 3, 4, 5, 6]},
			],
			"columns": [
				{"data": "id"             , "defaultContent": ""},
				{"data": "client_name"    , "defaultContent": ""},
				{"data": "invoiceNumber"  , "defaultContent": "S/R"},
				{"data": "appliancesCount", "defaultContent": "0"},
				{"data": "status"         , "defaultContent": ""},
				{"data": "createdAt_short", "defaultContent": ""},
				{"data": "closedAt_short" , "defaultContent": "Abierto"},
				{"data": this.serviceRequestButton, "defaultContent": ""}
			]
		};
	},

	serviceRequestButton: function(source, type, val){
		var model = app.storage.get('service_requests', source._id);
		if(type === "display"){ return model.serviceRequestButton(); }
		return source._id;
	},

	comparator: function(portletView){
		return (
				portletView instanceof App.Views.PortletView &&
				portletView.viewName === "ServiceRequestNewView" &&
				App.defined(portletView.view) &&
				App.defined(portletView.view.model) &&
				portletView.view.model.get('client_id') === this.parent.model.id
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
			client_id  : parentModel.get('_id')
		};
		var model = new app.storage.newModel("service_requests").set(object);
		app.Renderer.show({
			viewName: 'ServiceRequestNewView',
			viewType: 'new',
			storage : "service_requests",
			model   : model
		});
	},
});