App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template      : HBS.appliance_index_template,
	className     : "row",
	name          : "Equipos",
	collectionName: "appliances",
	
	tableEl        : '#appliances-table',

	moreEvents: {
		'click a[name=appliance-print]'   : 'print',
		'click a[name=appliance-download]': 'download',
		'click #printAppliancesPDF'       : 'printAppliances',
		'click #downloadAppliancesPDF'    : 'downloadAppliances',
	},
	
	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": [0, 5, 6, 8, 9] },
				{ "className": "center-v", "targets": -1 },
				{ "className": "center-v" , "targets": [1, 2, 3, 4, 7] },
				{ "width": "40px", "targets": -1}
			],
			"columns": [
				{"data": "id"},
				{"data": "client_name", "defaultContent": ""},
				{"data": "model"      , "defaultContent": ""},
				{"data": "brand"      , "defaultContent": ""},
				{"data": "serial"     , "defaultContent": "S/S"},
				{"data": this.repairementType},
				{"data": this.status},
				{"data": "technician_name", "defaultContent": "S/A"},
				{"data": "createdAt_short", "defaultContent": ""},
				{"data": "closedAt_short" , "defaultContent": "Abierto"},
				{"data": this.buttons     , "defaultContent": "" }
			],
		};
	},

	buttons: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		var ids = [source._id, source.service_request_id];
		if(type === "display"){
			return model.showButton()+model.printButton()+model.showServiceRequestButton()+model.downloadButton();
		}
		return ids.join(' ');
	},

	dates: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		if (type === 'display'){ model.datesList(); }
		return dates.join(' ');
	},

	status: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		if(type === 'display'){
			return model.statusLabel();
		}
		return source.status;
	},

	repairementType: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		var rep = source.repairement_type;
		if(type === 'display' && rep === "Presupuesto"){ return model.budgetList(); }
		if (parseInt(source.cost) > 0){rep = rep + ' ' + source.cost;}
		return rep;
	},

	printAppliances: function(e){
		e.preventDefault();
		this.collection.pdfReportPrint();
	},

	downloadAppliances: function(e){
		e.preventDefault();
		this.collection.pdfReportDownload();
	},

	showReportButtons: function(){
		this.$('#report-buttons').removeClass('hide');
	},
});