App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	defaults: function(){
		return {
			'status'            : 'Recibido',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},

	awake: function(){
		this.listenTo(this, 'change:repairement_type', this.checkCost);
		this.listenTo(this, 'sync', this.setRelatedFields);
		this.listenTo(this, 'add' , this.setRelatedFields);
	},

	setRelatedFields: function(){
		this.setClientName();
		this.setModelAndBrand();
		this.setTechnicianName();
		this.setDates();
		this.setSerial();
	},

	setClientName: function(){
		this.setRelatedField('clients', 'client_id', 'name', 'client_name');
	},

	setModelAndBrand: function(){
		this.setRelatedField('models', 'model_id', 'brand');
		this.setRelatedField('models', 'model_id', 'model');
	},

	setTechnicianName: function(){
		this.setRelatedField('techs', 'technician_id', 'name', 'technician_name');
	},

	setSerial: function(){
		this.cleanField('serial');
	},

	checkCost: function(){
		var repType = this.get('repairement_type');
		var cost    = this.get('cost');
		if (repType === 'Garantía'){
			if (App.defined(cost) && cost > 0){
				this.set('cost', 0);
			}
		}
	},

	statusClass: function(status){
		var className;
		switch (status){
		case "Recibido":
				className = "btn-status-1";
				break;
		case "En Reparación":
				className = "btn-status-2";
				break;
		case "En Espera":
				className = "btn-status-3";
				break;
		case "Atrasado":
				className = "btn-status-4";
				break;
		case "Reparado":
				className = "btn-status-5";
				break;
		case "Entregado":
				className = "btn-status-7";
				break;
		case "Enviado":
				className = "btn-status-6";
				break;
		}
		return className;
	},

	statusLabel: function(){
		var status = this.get('status');
		return	'<h4 style="margin: 0px;">' +
							'<span class="label label-default ' + this.statusClass(status) + '">' + 
								status +
							'</span>'+
						'</h4>';
	},

	budgetList: function(){
		var cost = this.get('cost');
		cost = (cost) ? cost : 0;
		return	'<dt>Presupuesto</dt>' +
						'<dd>$'+cost+',00</dd>';
	},

	datesList: function(){
		var dates = [
			this.get('createdAt_short'),
			this.get('updatedAt_short'),
			this.get('closedAt_short')
		];
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
	},

	showApplianceButton: function(){
		var id = this.id;
		return	'<a href="#render/appliance/show/'+id+'" class="btn btn-xs btn-green btn-margin"  id="appliance-details" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa fa-ellipsis-h fa-fw"></i>' +
						'</a>';
	},

	showServiceRequestButton: function(){
		var id = this.get('service_request_id');
		return	'<a href="#render/service_request/show/'+id+'" class="btn btn-xs btn-green btn-margin" id="appliance-service-request" data-toggle="tooltip" data-placement="top" title="Orden de Servicio">' +
							'<i class="fa fa-clipboard fa-fw"></i>' +
						'</a>';
	},
});