App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "row",
	name     : "Ordenes de Servicio",
	
	tableEl  : '#service_requests-table',

	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
				{ "className": "text-center", "targets": [0, 2, 3, 4, 5, 6]},
			],
			"columns": [
				{"data": "id", defaultContent: ""},
				{"data": this.clientName, "defaultContent": ""},
				{"data": function(source, type, val){
					if (!source.invoiceNumber || source.invoiceNumber === '')
					{ return 'S/R'; } else { return source.invoiceNumber; }
				}},
				{"data": this.serviceRequestInfo, "defaultContent": ""},
				{"data": "status", "defaultContent": ""},
				{"data": function(source, type, val){
					return moment(source.createdAt).format('DD/MM/YYYY');
				}, "defaultContent": ""},
				{"data": function(source, type, val){
					if(source.closedAt){
						return moment(source.closedAt).format('DD/MM/YYYY');
					}else{
						return "Abierto";
					}
				}, "defaultContent": "Abierto"},
				{"data": this.serviceRequestButton, "defaultContent": ""}
			]
		};
	},

	clientName: function (source, type, val) {
		if (source.client_id){
			try {
				if (!source.client_id){return "";}
				var name = app.storage.collection('clients').get(source.client_id).get('name'); 
				return (name) ? name : "";
			} catch (err) {
				console.log(err.stack);
				return "";
			}
		}
		return "";
	},

	serviceRequestInfo: function(source, type, val){
		var appliances = source.appliances;
		if(type === "sort"){
			if (_.isArray(appliances)){return appliances.length;}
			return 0;
		}
		if(type === "display"){
			var length = (_.isArray(appliances)) ? appliances.length : 0;
			return length;
		}
	},

	serviceRequestButton: function(source, type, val){
		if(type === "display"){
			return '<a href="#render/service_request/show/'+ source._id +'" class="btn btn-xs btn-green"  id="service_request-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
				'<i class="fa fa-ellipsis-h fa-fw"></i>' +
			'</a>';
		}
		return source._id;
	},

	events:{
		'click button#new-service-request': 'newServiceRequest',
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