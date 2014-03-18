App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "table-responisve",
	name     : "Clientes",
	
	tableEl        : '#clients-table',
	tableCollection: 'Clients',
	modelView      : App.Views.ClientRowView,
	
	onSync: function(){
		this.collection.fetch();
	},

	setCollection: function(){
		if(!App.defined(app.clients)){
			app.clients = new App.Collections.Clients();
		}
		return app.clients;
	},
});