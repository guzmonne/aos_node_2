App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "Clientes",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "table-responisve",

	oTable: null,

	initialize: function(){
		if (this.collection === undefined || this.collection === null || this.collection.length === 0){
			this.collection = clients;
			this.render();
		}
	},

	afterRender: function(){
		if (this.oTable === null){
			this.oTable = this.$('#clients-table').dataTable();
		}
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
		app.trigger('client:index:render');
	},

	attach: function(view, options){
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});