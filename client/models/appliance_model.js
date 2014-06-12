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

	printApplianceButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-green btn-margin"  name="appliance-print" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Imprimir">' +
							'<i class="fa fa-print fa-fw"></i>' +
						'</a>';
	},

	downloadApplianceButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-green btn-margin"  name="appliance-download" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Download">' +
							'<i class="fa fa-download fa-fw"></i>' +
						'</a>';
	},

	showServiceRequestButton: function(){
		var id = this.get('service_request_id');
		return	'<a href="#render/service_request/show/'+id+'" class="btn btn-xs btn-green btn-margin" id="appliance-service-request" data-toggle="tooltip" data-placement="top" title="Orden de Servicio">' +
							'<i class="fa fa-clipboard fa-fw"></i>' +
						'</a>';
	},

	appliancePDFReportDownload: function(){
		var filename, report = this.appliancePDFReport();
		fileName = 'Equipo_' + this.get('id') + '.pdf';
		pdfMake.createPdf(report).download(filename);
	},

	appliancePDFReportPrint: function(){
		var filename, report = this.appliancePDFReport();
		fileName = 'Equipo_' + this.get('id') + '.pdf';
		pdfMake.createPdf(report).print(filename);
	},

	appliancePDFReport: function(){
		return {
			pageSize: 'A4',
			pageMargins: [ 40, 20, 40, 20 ],
			content: this.appliancePDFMulti(3),
		};
	},

	appliancePDFMulti: function(copies){
		var result = [];
		var single = this.appliancePDFSingle();
		for(var i = 0; i < copies; i++){
			result.push(this.appliancePDFSingle());
		}
		return result;
	},

	appliancePDFSingle: function(){
		return {
			stack: [
				App.PDF.punktalLogoContent(),
				this.appliancePDFBody()
			]
		};
	},

	appliancePDFBody: function(){
		var appliance, phone, address, email, accessories, obs, defect, serial;
		try {
			appliance        = this.attributes;
			appliance.client = app.storage.get('clients', appliance.client_id).attributes;
			appliance.model  = app.storage.get('models' , appliance.model_id).attributes;
		} catch (err) {console.log(err.stack); return;}
		phone      = (_.isArray(appliance.client.phones)    && appliance.client.phones.length    > 1) ? appliance.client.phones[0].number : " ";
		address    = (_.isArray(appliance.client.addresses) && appliance.client.addresses.length > 1) ? appliance.client.addresses[0]     : " ";
		if (_.isObject(address)) {address = address.street + ',\n' + address.city + ',\n' + address.department + '.';} 
		accessories = (_.isArray(appliance.accessories) && appliance.accessories.length > 1) ? appliance.accessories.join(', ')   : " ";
		email      = (!_.isUndefined(appliance.client.email))                                ? appliance.client.email            : " ";
		obs        = (_.isString(appliance.observations)) ? appliance.observations  : " ";
		defect     = (_.isString(appliance.defect))       ? appliance.defect        : " ";
		obs        = (obs.length > 78)                    ? obs.substring(0, 78)    : obs;
		defect     = (defect.length > 78)                 ? defect.substring(0, 78) : defect;
		serial     = (_.isString(appliance.serial) && appliance.serial !== '') ? appliance.serial : " "; 
		return [
			{
				columns: [
					{
						width: 200,
						stack: [
							{columns: [ {text: "Nombre: "                       , width: 80, bold: true}, appliance.client.name ]},
							{columns: [ {text: appliance.client["doc-type"]+": ", width: 80, bold: true}, appliance.client["doc-number"] ]},
							{columns: [ {text: "Telefono: "                     , width: 80, bold: true}, phone ]},
							{columns: [ {text: "Direccion: "                    , width: 80, bold: true}, address ]},
							{columns: [ {text: "Email: "                        , width: 80, bold: true}, email ]},
						],
					},
					{
						width: '*',
						margin: [10, 0, 0, 0],
						stack: [
							{	 
								columns: [ 
									{text: "ID: ", fontSize: 25, width: 50}, {text: appliance.id.toString(), fontSize: 25, bold: true}, 
								], 
								margin: [0,-14, 0, 0], 
							},
							{
								columns: [
									{text: "Marca: "  , width: 50, bold: true},
									{text: appliance.model.brand  , width: 70},
									{text: "Modelo: " , width: 65, bold: true},
									{text: appliance.model.model  , width: "*"},
								]
							},
							{
								columns: [
									{text: "Serie: ", width: 50, bold: true},
									{text: serial, width: 70},
									{text: "Accesorios: ", width: 65, bold: true},
									{text: accessories, width: "*"}, //36
								]
							},
							{
								columns: [
									{text: "Obs: ", width: 50, bold: true},
									{text: obs, width: "*"},//78
								]
							},
							{
								columns: [
									{text: "Defecto: ", width: 50, bold: true},
									{text: defect, width: "*"}, //78
								]
							},
						],
					},
				],
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					body: [[" ", " "], [{"text": "Fecha de Impreso: " + moment(new Date()).format('DD/MM/YYYY HH:ss'), alignment: "left", margin: [0, 0, 0, 20]}, {"text": "Fecha de Ingreso: " + moment(appliance.createdAt).format('DD/MM/YYYY HH:ss'), alignment: "right", margin: [0, 0, 0, 20]}] ]
				},
				layout: "headerLineOnly"
			},
		];
	},
});