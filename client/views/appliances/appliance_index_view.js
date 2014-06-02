App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	tableCollection: 'Appliances',
	modelView      : App.Views.ApplianceRowView,

	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": 7 },
				{ "className": "center-vh", "targets": [ 0, 1, 2, 3, 4, 5, 7] }
			]
		};
	},
});