App.Views.TableView = App.Views.BaseView.extend({
	oTable        : null,
	firstRender   : true,
	rowViewOptions: {},

	initialize: function(){
		var self = this;
		if(App.defined(this.beforeInitialize) && _.isFunction(this.beforeInitialize)){
			this.beforeInitialize();
		}
		if(!App.defined(this.tableCollection)){
			return new Error('Attribute tableCollection must be set.');
		}
		if(!App.defined(App.Collections[this.tableCollection])){
			return new Error('This tableCollection is not defined.');
		}
		if (!App.defined(this.collection)){
			if(App.defined(this.setCollection)){
				this.collection = this.setCollection();
			} else {
				this.collection = new App.Collections[this.tableCollection]();
			}
		}
		this.listenTo(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'sync', this.afterSync);
	},

	afterRender: function(){
		if(!App.defined(this.tableEl)){
			return new Error('Attribute tableEl must be set.');
		}
		this.oTable = this.$(this.tableEl).dataTable();	
		if (this.firstRender){
			if(this.collection.length > 0){
				this.appendCollection(this.collection);
			} else {
				this.collection.fetch();
			}
			this.firstRender = false;
		}
	},

	appendCollection: function(collection){
		var self = this;
		_.each(collection.models, function(model){
			self.append(model);
		});
	},	

	append: function(model){
		if (App.defined(this.modelView)){
			this.rowViewOptions.model = model;
			var view = new this.modelView(this.rowViewOptions);
			this.addChild(view);
			this.oTable.fnAddTr(view.render().el);
		} else {
			return new Error('Option modelView not defined');
		}
	},
});