App.Views.TableView = App.Views.BaseView.extend({
	//firstRender   : true,
	rowViewOptions: {},
	fetchOptions	: {},
	fetchOnRender : true,

	initialize: function(){
		var self = this;
		this.awake.apply(this, arguments);
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
		if (this.oTable){return;}
		this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
		this.listenTo(this.collection, 'add', this.append);
		if (this.fetchOnRender){
			this.collection.fetch(this.fetchOptions);
		}
	},
});