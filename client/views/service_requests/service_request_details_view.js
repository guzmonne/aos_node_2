App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	events: {
		'click #printPDF'   : 'printPDF',
		'click #downloadPDF': 'downloadPDF',
	},

	bindings: {
		'[name=client_id]': {
			observe: 'client_id',
			onGet: function(id){
				try {
					var name = app.storage.get('clients', id).get('name'); 
					return '<a href="#render/client/show/'+id+'">'+name+'</a>';
				} catch (err) {
					return "";
				}
			},
			updateMethod: 'html'
		},
		'[name=status]': 'status',
		'[name=invoiceNumber]': {
			observe: 'invoiceNumber',
			onGet  : function(value){
				if (!App.defined(value) || value === ''){return '';}
				return '<h3 class="pull-right">Remito: <span class="text-primary">'+value+'</span></h3>';
			},
			updateMethod: 'html'
		},
		'[name=createdAt]': {
			observe: 'createdAt',
			onGet: function(value){
				return App.dateDDMMYYYY(value);
			},
		},
		'[name=createdBy]': 'createdBy',
		'[name=updatedAt]': {
			observe: 'updatedAt',
			onGet: function(value){
				return App.dateDDMMYYYY(value);
			},
		},
		'[name=updatedBy]': 'updatedBy',
	},

	awake: function(){
		this.listenTo(this.model, 'change:name', this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.renderApplianceIndex();
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model) || this.appliancesIndex){return;}
		var self = this;
		var el = this.$('#service-request-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced       : true,
			collection   : app.storage.getSubCollection("appliances", {
				service_request_id: this.model.id,
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	buildReport: function(){
		if (this.report){return this.report;}
		var self = this;
		var body = {}, tbody = [], clientName = '', content = [];
		try {clientName = app.storage.get('clients', this.model.get('client_id')).get('name');}
		catch(err){console.log(err.stack);}
		var tBodyHeader = [
			App.PDF.text('IDS'          , 'tableHeader'), 
			App.PDF.text('Marca'        , 'tableHeader'), 
			App.PDF.text('Modelo'       , 'tableHeader'), 
			App.PDF.text('Cantidad'     , 'tableHeader'), 
			App.PDF.text('Observaciones', 'tableHeader')
		];
		var header = App.PDF.text(
			[
				{text: 'Cliente:', style: 'header'},
				{text: clientName, style: 'greyHeader'},
			]
		);
		tbody.push(tBodyHeader);
		body = this.fillTableObject();
		_.each(body, function(value, key, list){
			var array = [
				value._ids, 
				value.brand,
				value.model,
				{text: value.qty.toString(), alignment: 'center'},
			];
			var obs = '';
			if (value.serials !== ''){obs = 'Series: ' + value.serials;}
			if (value.defects !== ''){
				if (obs !== ''){obs = obs + '\n'; }
				obs = obs + 'Defectos: ' + value.defects;
			}
			array.push(obs);
			tbody.push(array);
		});
		//content.push(App.PDF.punktalLogo);
		content.push(App.PDF.columns(
			[
				header,
				App.PDF.text(moment(new Date()).format('DD/MM/YYYY'), {margin: [0, 5, 0, 10], alignment: 'right'})
			]
		));
		content.push(App.PDF.table(tbody, {widths: [ 30, 60, 50, 50, '*' ]}, 'lightHorizontalLines'));
		this.report = {
			pageSize: 'A4',
			pageMargins: [ 40, 40, 40, 100 ],
			content: content,
			footer: [
				App.PDF.clientSign,
				App.PDF.columnsLorem,
			]
		}; 
		return this.report; 
	},

	downloadPDF: function(){
		var filename, report = this.buildReport();
		fileName = 'OdeS_' + this.model.get('id') + '.pdf';
		pdfMake.createPdf(report).download(fileName);
	},

	printPDF: function(){
		var filename, report = this.buildReport();
		pdfMake.createPdf(report).print();
	},

	fillTableObject: function(){
		var body = {}, model_id, model, appliance, appliancesIds = this.model.get('appliances');
		console.log(this.model);
		for(var i = 0; i < appliancesIds.length; i++){
			try {
				if (_.isObject(appliancesIds[i])){
					appliance = appliancesIds[i];
				} else {
					appliance = app.storage.get('appliances', appliancesIds[i]).attributes;
				}
			}
			catch(err){console.log(err.stack); throw new Error("Can't find appliance");}
			try {
				model_id = appliance.model_id;
				model    = app.storage.get('models', model_id);
			}
			catch(err){console.log(err.stack); throw new Error("Can't find model");}
			if (body[model_id]){
				body[model_id].qty++;
				body[model_id]._ids = body[model_id]._ids + '; ' + appliance.id; 
				if (appliance.serial){
					body[model_id].serials = body[model_id].serials + '; ' + appliance.serial; 
				}
				if (appliance.defect){
					body[model_id].defects = body[model_id].defects + '; ' + appliance.defect; 
				}
			} else {
				body[model_id] = {
					_ids: appliance.id.toString(),
					qty: 1,
					model: model.get('model'),
					brand: model.get('brand')
				};
				body[model_id].serials = (appliance.serial)  ? appliance.serial : '';
				body[model_id].defects = (appliance.defects) ? appliance.defects : '';
			}
		}
		return body;
	},
});