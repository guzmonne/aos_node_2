App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row air-b",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	tableCollection: 'Appliances',
	modelView      : App.Views.ApplianceRowView,
});