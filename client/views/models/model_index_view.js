App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modelos",
	
	tableEl        : '#models-table',
	tableCollection: 'Models',
	modelView      : App.Views.ModelRowView,
	fetchOptions		: {
		data: {
			fields: 'brand model category subcategory _id'
		}
	},
});