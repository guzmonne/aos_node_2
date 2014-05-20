App.Views.TableView = App.Views.BaseView.extend({
	rowViewOptions: {},
	fetchOptions	: {},

	events: {
		'click ul.pagination li': 'scrollToTable',
	},

	constructor: function(options){
		this.rendered = false;
		this.synced   = (options.synced) ? options.synced : false;
		Giraffe.View.apply(this, arguments);
	},

	initialize: function(){
		var self = this;
		this.awake.apply(this, arguments);
		this.listenTo(this.collection, 'sync', this.tableFetched);
		this.listenTo(this, 'disposing', function(){
			this.$('click ul.pagination li').off('click');
		});
		_.bind(this.append, this);
		this.timestamp = _.uniqueId();
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	afterRender: function(){
		var self = this;
		if(!App.defined(this.tableEl)){
			throw new Error('Attribute tableEl must be set.');
		}
		if(this.synced === true && this.rendered === false){ this.appendCollection(); }
		this.rendered = true;
	},

	scrollToTable: function(){
		console.log('scrollToTable');
		App.scrollTo(this.$('table'));
	},

	setScrollEvent: function(){
		var self = this;
		this.$('click ul.pagination li a').off('click');
		this.$('click ul.pagination li a').on('click', function(){self.scrollToTable();});
	},

	appendCollection: function(collection){
		var self   = this;
		this.$('tbody').remove();
		this.tbody = $('<tbody />');
		_.each(this.collection.models, function(model){
			self.rowViewOptions.model = model;
			var view = new self.modelView(self.rowViewOptions);
			self.addChild(view);
			self.tbody.append(view.render().el);
		});
		this.$('table').append(this.tbody);
		this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
		this.$('table').wrap('<div class="table-wrap table-responsive-width"></div>');
		this.stopListening(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'add', this.append);
		this.setScrollEvent();
	},

	tableFetched: function(){
		if(this.rendered === true && this.synced === false){ this.appendCollection(); }
		this.synced = true;
	},	

	append: function(model){
		if (!App.defined(this.modelView)){throw new Error('Option modelView not defined');}
		this.rowViewOptions.model = model;
		var view = new this.modelView(this.rowViewOptions);
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
		this.setScrollEvent();
	},

	onSync: function(){
		this.sync("collection", this.fetchOptions);
	},
});