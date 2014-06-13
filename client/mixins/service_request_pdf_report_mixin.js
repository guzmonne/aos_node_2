App.Mixins.ServiceRequestPDFReport = _.extend({
	reportName: function(){
		return 'OdeS_' + this.get('id') + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize: 'A4',
			pageMargins: [ 40, 100, 40, 100 ],
			header: App.PDF.punktalLogoHeader(),
			content: this.reportContent(),
			footer: [
				App.PDF.clientSign,
				App.PDF.columnsLorem,
			]
		};
	},

	reportContent: function(){
		var self = this;
		var body = {}, tbody = [], clientName = '', content = [];
		try {clientName = app.storage.get('clients', this.get('client_id')).get('name');}
		catch(err){console.log(err.stack);}
		var h1 = App.PDF.text([
				{text: 'Numero de Orden: ', style: 'header'},
				{text: this.get('id').toString(), style: 'greyHeader'},
			]
		);
		var h2 = App.PDF.text(
			[
				{text: 'Cliente: ', style: 'subHeader'},
				{text: clientName, style: 'greySubHeader'},
			]
		);
		var tBodyHeader = [
			App.PDF.text('IDS'          , 'tableHeader'), 
			App.PDF.text('Marca'        , 'tableHeader'), 
			App.PDF.text('Modelo'       , 'tableHeader'), 
			App.PDF.text('Cantidad'     , 'tableHeader'), 
			App.PDF.text('Observaciones', 'tableHeader')
		];
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
		content.push(App.PDF.columns(
			[
				{stack: [h1, h2]},
				App.PDF.text(moment(new Date()).format('DD/MM/YYYY'), {margin: [0, 5, 0, 10], alignment: 'right'})
			]
		));
		content.push(App.PDF.table(tbody, {widths: [ 30, 60, 50, 50, '*' ]}, 'lightHorizontalLines'));
		return content;
	}, 

	fillTableObject: function(){
		var body = {}, model_id, model, appliance, appliancesIds = this.get('appliances');
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
}, App.Mixins.PDFReport);