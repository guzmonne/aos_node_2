App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "row",
	name     : "Clientes",
	
	tableEl        : '#clients-table',
	tableCollection: App.Collections.Clients,
	modelView      : App.Views.ClientRowView,

	appStorage      : 'clients',

	afterAppend: function(){
		if (this.selection){
			this.$('a#show-client').remove();
			this.$('a#select-client').removeClass('hide');
		}
	},
});