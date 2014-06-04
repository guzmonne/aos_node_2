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
			],
			"columns": [
				{"data": "id"},
				{"data": function (source, type, val) {
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
					"defaultContent": ""
				},
				{"data": function(source, type, val){
						var appliances = source.appliances;
						if(type === "sort"){
							if (_.isArray(appliances)){return appliances.length;}
							return 0;
						}
						if(type === "display"){
							var length = (_.isArray(appliances)) ? appliances.length : 0;
							var html   = '<ul class="list-unstyled"><li><strong>Equipos:</strong> '+length+'</li>';
							if (source.invoiceNumber && source.invoiceNumber !== ''){
								html = html + '<li><strong>Remito:</strong> '+source.invoiceNumber+'</li>';
							}
							return html + '</ul>';
						}
					},
					"defaultContent": "" 
				},
				{"data": "status"},
				{"data": function(source, type, val){
						var dates = [];
						dates.push(App.dateDDMMYYYY(source.createdAt));
						dates.push(App.dateDDMMYYYY(source.updatedAt));
						if (source.closedAt) { dates.push(App.dateDDMMYYYY(source.closedAt));}
						if (type === 'display'){
							var html =
								'<dt>Creado</dt>' + 
								'<dd>'+ dates[0] +'</dd>' +
								'<dt>Actualizado</dt>' +
								'<dd>'+ dates[1] +'</dd>';
							if (dates.length === 3) {
								html = html + 
								'<dt>Cerrado</dt>' +
								'<dd>'+ dates[2] +'</dd>';
							}
							return html;
						}
						return dates.join(' ');
					},
					"defaultContent": ""
				},
				{"data": function(source, type, val){
						if(type === "display"){
							return '<a href="#render/service_request/show/'+ source._id +'" class="btn btn-green"  id="service_request-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
								'<i class="fa fa-ellipsis-h fa-fw"></i>' +
							'</a>';
						}
						return source._id;
					},
					"defaultContent": ""
				}
			]
		};
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