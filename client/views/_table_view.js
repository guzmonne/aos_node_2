App.Views.TableView = App.Views.BaseView.extend({
	rowViewOptions : {},
	fetchOptions   : {},
	fetchOnRender  : false,

	initialize: function(options){
		if (_.isFunction(this.awake)){this.awake(options);}
		if (this.collection){
			this.listenToOnce (this.collection    , 'sync', this.appendCollection);
			this.listenTo     (this.collection    , 'add' , this.append);
		}
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
		if (this.collection){
			this.appendCollection(this.collection);
		}
	},

	appendCollection: function(collection){
		if (this.collection){
			collection = (collection) ? collection : this.collection;	
		}
		if (collection.length === 0){return;}
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
		var self = this;
		var options = {
			success: function(){
				self.afterSync();
			}
		};
		_.extend(options, this.fetchOptions);
		this.collection.fetch(this.fetchOptions);
	},

	activateTable: function(){
		this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
		if (this.fetchOnRender){
			var options = this.fetchOptions;
			options.silent = (options.silent) ? (options.silent) : true;
			this.collection.fetch(this.fetchOptions);
			this.fetchOnRender = false;
		}
	},
});