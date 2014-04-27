App.Views.TableView = App.Views.BaseView.extend({
	firstRender   : true,
	rowViewOptions: {},

	initialize: function(){
		var self = this;
		if(App.defined(this.beforeInitialize) && _.isFunction(this.beforeInitialize)){
			this.beforeInitialize();
		}
		if (!App.defined(this.collection)){
			if(_.isFunction(this.setCollection)){
				this.collection = this.setCollection();
			} else {
				this.collection = new this.tableCollection();
			}
		}
		this.listenTo(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'sync', this.afterSync);
		_.bind(this.append, this);
		this.timestamp = _.uniqueId();
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	setCollection: function(){
		if(!App.defined(app[this.appStorage])){
			app[this.appStorage] = new this.tableCollection();
		}
		return app[this.appStorage];
	},

	afterRender: function(){
		if(!App.defined(this.tableEl)){
			return new Error('Attribute tableEl must be set.');
		}
		if (this.firstRender){
			this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
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

	onSync: function(){
		this.collection.fetch();
	},
});