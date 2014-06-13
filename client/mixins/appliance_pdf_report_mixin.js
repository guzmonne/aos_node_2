App.Mixins.AppliancePDFReport = _.extend({
	reportName: function(){
		return 'Equipo_' + this.get('id') + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize   : 'A4',
			pageMargins: [ 40, 15, 40, 15 ],
			content    : this.appliancePDFMulti(3),
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
		var cLengthS = 12;
		var cLengthM = 18;
		var cLengthL = 78;
		var bLine    = 3;
		var lHeight  = 14;
		var appliance, phone, address, email, accessories, obs, defect, serial;
		try {
			appliance        = this.attributes;
			appliance.client = app.storage.get('clients', appliance.client_id).attributes;
			appliance.model  = app.storage.get('models' , appliance.model_id ).attributes;
		} catch (err) {console.log(err.stack); return;}
		phone      = (_.isArray(appliance.client.phones)    && appliance.client.phones.length    > 0) ? appliance.client.phones[0].number : " ";
		address    = (_.isArray(appliance.client.addresses) && appliance.client.addresses.length > 0) ? appliance.client.addresses[0]     : " ";
		if (_.isObject(address)) {address = address.street + ', ' + address.city + ', ' + address.department + '.';} 
		accessories = (_.isArray(appliance.accessories) && appliance.accessories.length > 1) ? appliance.accessories.join(', ')   : " ";
		email       = (!_.isUndefined(appliance.client.email))                                ? appliance.client.email             : " ";
		obs         = (_.isString(appliance.observations)) ? appliance.observations.replace(/(\r\n|\n|\r)/gm," ") : " ";
		defect      = (_.isString(appliance.defect))       ? appliance.defect.replace(/(\r\n|\n|\r)/gm," ")       : " ";
		serial      = (_.isString(appliance.serial) && appliance.serial !== '') ? appliance.serial : " ";
		if (address.length > cLengthS)			{bLine--;}
		if (address.length > 2 * cLengthS)	{bLine--;}
		if (accessories.length > cLengthM)	{bLine--;}
		if (obs.length    > cLengthL/2)			{bLine--;} 
		if (defect.length > cLengthL/2)			{bLine--;}
		if (bLine < 0){bLine = 0;}
		return [
			{
				columns: [
					{
						width: 200,
						stack: [
							{columns: [ {text: "Nombre: "                       , width: 80, bold: true}, appliance.client.name.substring(0, cLengthM) ]},
							{columns: [ {text: appliance.client["doc-type"]+": ", width: 80, bold: true}, appliance.client["doc-number"].substring(0, cLengthM) ]},
							{columns: [ {text: "Telefono: "                     , width: 80, bold: true}, phone.substring(0, cLengthM) ]},
							{columns: [ {text: "Direccion: "                    , width: 80, bold: true}, address.substring(0, 3*cLengthM) ]},
							{columns: [ {text: "Email: "                        , width: 80, bold: true}, email.substring(0, cLengthM) ]},
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
									{text: appliance.model.brand.substring(0, cLengthS)  , width: 70},
									{text: "Modelo: " , width: 65, bold: true},
									{text: appliance.model.model.substring(0, cLengthM)  , width: "*"},
								]
							},
							{
								columns: [
									{text: "Serie: ", width: 50, bold: true},
									{text: serial.substring(0, cLengthS), width: 70},
									{text: "Accesorios: ", width: 65, bold: true},
									{text: accessories.substring(0, cLengthM*2), width: "*"}, //36
								]
							},
							{
								columns: [
									{text: "Obs: ", width: 50, bold: true},
									{text: obs.substring(0, cLengthL), width: "*"},
								]
							},
							{
								columns: [
									{text: "Defecto: ", width: 50, bold: true},
									{text: defect.substring(0, cLengthL), width: "*"}, 
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
					body: [
						[
							{text: " ", margin: [0, (lHeight*bLine), 0, 0]},
							" "
						], 
						[
							{"text": "Fecha de Impreso: " + moment(new Date()).format('DD/MM/YYYY HH:mm'), alignment: "left", margin: [0, 0, 0, 20]},
							{"text": "Fecha de Ingreso: " + moment(appliance.createdAt).format('DD/MM/YYYY HH:mm'), alignment: "right"}
						] 
					]
				},
				layout: "headerLineOnly"
			},
		];
	},
}, App.Mixins.PDFReport);