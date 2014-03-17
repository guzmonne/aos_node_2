App.Views.ClientIndexView = App.Views.BaseView.extend({
	name       : "Clientes",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "table-responisve",

	oTable: null,

	initialize: function(){
		this.collection = new App.Collections.Clients();
		this.listenTo(this.collection, 'add', this.attach);
	},

	afterRender: function(){
		this.oTable = this.$('#clients-table').dataTable();
		this.collection.fetch();
	},

	attach: function(model){
		var view = new this.modelView({model: model});
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});