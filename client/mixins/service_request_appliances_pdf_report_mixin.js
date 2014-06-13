App.Mixins.ServiceRequestAppliancesPDFReport = _.extend({
	reportName: function(){
		if (this.models.length === 0) {return 'file.pdf';}
		var service_request_id;
		try { 
			service_request_id = app.storage.get('service_requests', this.models[0].get('service_request_id')).get('id');
		} catch (err) {console.log(err.stack); return 'file.pdf';}
		return 'Equipos_de_OdeS_' + service_request_id + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize   : 'A4',
			pageMargins: [ 40, 15, 40, 15 ],
			content    : this.reportContent()
		};
	},

	reportContent: function(){
		if (this.length === 0) {return;}
		if (this.length === 1) {
			return this.models[0].appliancePDFMulti(3);
		}
		var result = [];
		_.each(this.models, function(model, index, models){
			var stack = {
				stack: model.appliancePDFMulti(3)
			};
			if (index !== (models.length - 1)){stack.pageBreak = 'after';}
			result.push(stack);
		});
		return result;
	},
}, App.Mixins.PDFReport);