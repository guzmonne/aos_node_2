App.Views.ClientIndexView = App.Views.BaseView.extend({
	name       : "Clientes",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "table-responisve",

	oTable: null,

	initialize: function(){
		var self = this;
		if (!App.defined(app.clients)){
			app.clients = new App.Collections.Clients();
		}
		this.collection = app.clients;
		this.listenTo(this.collection, 'add', this.attach);
		this.listenTo(this.collection, 'sync', this.afterSync);
	},

	afterRender: function(){
		var self = this;
		this.oTable = this.$('#clients-table').dataTable();
		if(this.collection.length > 0){
			_.each(this.collection.models, function(model){
				self.attach(model);
			});
		}
		this.collection.fetch({remove: false});
	},

	onSync: function(){
		this.collection.fetch();
	},

	attach: function(model){
		var view = new this.modelView({model: model});
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});