App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	
	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": [0, 4, 5, 6, 8, 9] },
				{ "className": "center-vh", "targets": -1 },
				{ "className": "center-v" , "targets": [1, 2, 3, 7] },
			],
			"columns": [
				{"data": "id"},
				{"data": this.clientName},
				{"data": this.brandName},
				{"data": this.modelName},
				{"data": this.serial},
				{"data": this.repairementType},
				{"data": this.status},
				{"data": this.technicianName, "defaultContent": "S/A"},
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
				{"data": this.buttons, "defaultContent": "" }
			],
		};
	},

	serial: function(source, type, val){
		if (_.isUndefined(source.serial) || source.serial === ''){return 'S/S';}else{return source.serial;}
	},

	buttons: function(source, type, val){
		var ids = [source._id, source.service_request_id];
		if(type === "display"){
			return '<a href="#render/appliance/show/'+ ids[0] +'" class="btn btn-xs btn-green btn-margin"  id="appliance-details" data-id="'+ids[0]+'" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
					'<i class="fa fa-ellipsis-h fa-fw"></i>' +
				'</a>' +
				'<br>' +
				'<a href="#render/service_request/show/'+ ids[1] +'" class="btn btn-xs btn-green btn-margin" id="appliance-service-request" data-toggle="tooltip" data-placement="top" title="Orden de Servicio">' +
					'<i class="fa fa-clipboard fa-fw"></i>' +
				'</a>';
		}
		return ids.join(' ');
	},

	dates: function(source, type, val){
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

	technicianName: function (source, type, val) {
		if (source.technician_id){
			try {
				return app.storage.collection('techs').get(source.technician_id).get('name');
			} catch (err) {
				console.log(err.stack);
				return "S/A";
			}
		}
		return "S/A";
	},

	status: function(source, type, val){
		if(type === 'display'){
			return	'<h4 style="margin: 0px;"><span class="label label-default ' + App.statusClass(source.status) + '">' + 
								source.status +
							'</span></h4>';
		}
		return source.status;
	},

	repairementType: function(source, type, val){
		var rep = source.repairement_type;
		if(type === 'display' && rep === "Presupuesto"){
			var cost = (source.cost) ? source.cost : 0;
			return	'<dt>Presupuesto</dt>' +
							'<dd>$'+cost+',00</dd>';
		}
		if (parseInt(source.cost) > 0){rep = rep + ' ' + source.cost;}
		return rep;
	},

	modelName: function (source, type, val) {
		if (source.model_id){
			try {
				return app.storage.collection('models').get(source.model_id).get('model');
			} catch (err) {
				console.log(err.stack);
				return "";
			}
		}
		return "";
	},

	brandName: function (source, type, val) {
		if (source.model_id){
			try {
				return app.storage.collection('models').get(source.model_id).get('brand');
			} catch (err) {
				console.log(err.stack);
				return "";
			}
		}
		return "";
	},

	clientName: function (source, type, val) {
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
});