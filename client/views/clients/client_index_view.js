App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "row",
	name     : "Clientes",
	
	tableEl     : '#clients-table',
	modelView   : App.Views.ClientRowView,
	fetchOptions: {
		data: {
			fields: '-service_requests'
		}
	},
});