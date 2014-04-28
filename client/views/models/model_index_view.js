App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modeles",
	
	tableEl        : '#models-table',
	tableCollection: App.Collections.Models,
	modelView      : App.Views.ModelRowView,

	appStorage  : 'models',
	fetchOptions		: {
		data: {
			fields: 'brand model category subcategory'
		}
	},
});