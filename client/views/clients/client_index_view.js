App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "App.Views.ClientIndexView",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "row",

	oTable: null,

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(){
		this.closeView = App.Views.BaseView.prototype.closeView;
		if (this.collection === undefined || this.collection === null || this.collection.length === 0){
			this.collection = clients;
			this.render();
		}
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInLeft');
		console.log(this.oTable);
		if (this.oTable === null){
			this.oTable = this.$('#clients-table').dataTable();
		}
		this.$el.tooltip();
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
	},

	attach: function(view, options){
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});