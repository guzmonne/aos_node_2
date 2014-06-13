App.Mixins.PDFReport = {
	pdfReportDownload: function(){
		var filename = (_.isFunction(this.reportName)) ? this.reportName() : 'file.pdf'; 
		pdfMake.createPdf(this.pdfReport()).download(filename);
	},

	pdfReportPrint: function(){
		pdfMake.createPdf(this.pdfReport()).print();
	},
};