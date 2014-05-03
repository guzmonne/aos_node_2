App.Views.TableView = App.Views.BaseView.extend({
	//firstRender   : true,
	rowViewOptions: {},
	fetchOptions	: {},
	fetchOnRender : true,

	initialize: function(){
		var self = this;
		// Let the parent view run some commands before the tableView initializes
		if(App.defined(this.beforeInitialize) && _.isFunction(this.beforeInitialize)){
			this.beforeInitialize();
		}
		// If a collection was passed then we check if there is a custom 'setCollection()'
		// method or we have to instantiate a new one based on the 'tableCollection' defined.
		// Else we continue the initializing.
		if (!App.defined(this.collection)){
			if(_.isFunction(this.setCollection)){
				this.collection = this.setCollection();
			} else {
				if (!App.defined(this.tableCollection)){
					return new Error('A tableCollection must be defined on the view');
				}
				this.collection = app.getAppStorage(this.tableCollection);
			}
		}
		this.listenTo(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'sync', this.afterSync);
		_.bind(this.append, this);
		_.once(this.activateTable);
		this.timestamp = _.uniqueId();
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	afterRender: function(){
		if(!App.defined(this.tableEl)){
			return new Error('Attribute tableEl must be set.');
		}
		this.activateTable();
		this.appendCollection(this.collection);
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
		this.collection.fetch(this.fetchOptions);
	},

	activateTable: function(){
		this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
		if (this.fetchOnRender){
			this.collection.fetch(this.fetchOptions);
		}
	},
});