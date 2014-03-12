App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "App.Views.ClientIndexView",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "row",

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(){
		this.closeView = App.Views.BaseView.prototype.closeView;
	},

	afterRender: function(){
		this.oTable     = this.$('#clients-table').dataTable();
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
		if (this.collection.length === 0){
			this.collection = clients;
			this.render();
		}
	},

	attach: function(view, options){
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});