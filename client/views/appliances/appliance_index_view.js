App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',

	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": [0, 3, 4, 5, 7] },
				{ "className": "center-v" , "targets": [1, 2, 6, 7] },
			],
			"columns": [
				{"data": "id"},
				{"data": function (source, type, val) {
						if (source.client_id){
							try {
								if (!source.client_id){return "";}
								return app.storage.collection('clients').get(source.client_id).get('name');
							} catch (err) {
								console.log(err.stack);
								return "";
							}
						}
						return "";
					},
					"defaultContent": "" 
				},
				{"data": function (source, type, val) {
						if (source.model_id){
							try {
								if (!source.model_id){return "";}
								var object = app.storage.collection('models').get(source.model_id).attributes; 
								if (source.serial){object.serial = source.serial;}
								if (type === 'display') {
									var html =	
										'<dt>' + object.brand + '</dt>' + 
										'<dd>' + object.model + '</dd>';
									if (object.serial){html = html + '<dd><i class="fa fa-barcode">  ' + object.serial + '</dd>';}
									return html;
								} else {
									return object.brand + ' ' + object.model + ' ' + object.serial;
								}
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
						var rep = source.repairement_type;
						if(type === 'display' && rep === "Presupuesto"){
							var cost = (source.cost) ? source.cost : 0;
							return	'<dt>Presupuesto</dt>' +
											'<dd>$'+cost+',00</dd>';
						}
						if (parseInt(source.cost) > 0){rep = rep + ' ' + source.cost;}
						return rep;
					}
				},
				{"data": function(source, type, val){
						if(type === 'display'){
							return	'<h4 style="margin: 0px;"><span class="label label-default ' + App.statusClass(source.status) + '">' + 
												source.status +
											'</span></h4>';
						}
						return source.status;
					}
				},
				{"data": function (source, type, val) {
						if (source.technician_id){
							try {
								if (!source.technician_id){return "";}
								return app.storage.collection('techs').get(source.technician_id).get('name');
							} catch (err) {
								console.log(err.stack);
								return "S/A";
							}
						}
						return "S/A";
					},
					"defaultContent": "S/A" 
				},
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
						var ids = [source._id, source.service_request_id];
						if(type === "display"){
							return '<a href="#render/appliance/show/'+ ids[0] +'" class="btn btn-green"  id="appliance-details" data-id="'+ids[0]+'" data-toggle="tooltip" data-placement="top" title="Mas Información" style="margin-bottom: 3px;">' +
									'<i class="fa fa-ellipsis-h fa-fw"></i>' +
								'</a>' +
								'<br>' +
								'<a href="#render/service_request/show/'+ ids[1] +'" class="btn btn-green" id="appliance-service-request" data-toggle="tooltip" data-placement="top" title="Orden de Servicio" style="margin-top: 3px">' +
									'<i class="fa fa-clipboard fa-fw"></i>' +
								'</a>';
						}
						return ids.join(' ');
					},
					"defaultContent": "" 
				}
			],
		};
	},
});