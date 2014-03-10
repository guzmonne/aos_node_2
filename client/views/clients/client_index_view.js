App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "App.Views.ClientIndexView",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "row",

	afterRender: function(){
		this.oTable = this.$('#clients-table').dataTable();
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
	},

	attach: function(view, options){
		this.app.clientIndex.oTable.fnAddTr(view.render().el);
	},
});