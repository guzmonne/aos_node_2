App.Views.TableView = App.Views.BaseView.extend({
	constructor: function(options){
		this.rowViewOptions   = {};
		this.fetchOptions     = {};
		this.dataTableOptions = {};
		this.rendered = false;
		this.synced   = (options.synced) ? options.synced : false;
		Giraffe.View.apply(this, arguments);
	},

	events: {
		'click a[name=select]': 'selected',
	},

	initialize: function(){
		var self = this;
		this.awake.apply(this, arguments);
		this.listenTo(this.collection, 'sync'              , this.tableFetched);
		this.listenTo(app            , 'nav:toggleMenu:end', this.adjustColumns);
		this.$el.on  (      'resize'   , function(){self.adjustColumns.apply(self);});
		this.listenTo(this, 'disposing', function(){this.$el.off('resize');});
		this.timestamp = _.uniqueId();
	},

	bindEvents: function(){
		this.listenTo(this.collection, 'change', this.updateTable);
		this.listenTo(this.collection, 'add'   , this.addRow);
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

	appendCollection: function(collection){
		var self    = this;
		var options = _.extend({
			"scrollY"       : 600,
			"scrollCollapse": true,
			"deferRender"   : true,
			"stateSave"     : true,
			"stateDuration" : -1,
			"data"          : this.collection.toJSON(),
			"scrollX"       : true,
			"sScrollXInner" : "100%",
			//"sScrollX"      : "98%",
		}, this.dataTableOptions);
		// Table jQuery Object
		this.$table  = this.$(this.tableEl + "-" + this.timestamp);
		// Table Datatable Object
		this.$oTable = this.$table.dataTable(options);
		// Table Datatable API Object
		this.oTable  = this.$oTable.api();
		this.$('.dataTables_scrollHead').css('margin-bottom', '-20px');
		this.bindEvents();
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
		this.oTable.row.add(view.model.toJSON());
	},

	onSync: function(){
		this.sync("collection", this.fetchOptions);
	},

	adjustColumns: function(){
		if(!this.$oTable){return;}
		this.$oTable.fnAdjustColumnSizing();
	},

	getModelIndex: function(model){
		if(!this.$oTable){return;}
		if(_.isString(model)){model = this.collection.get(model);}
		return this.collection.indexOf(model);
	},

	updateTable: function(model){
		var index = this.getModelIndex(model);
		if(!index){return;}
		this.$oTable.fnUpdate(model.attributes, index);
	},

	addRow: function(model){
		var rowNode = this.oTable.row.add(model.attributes).draw().node();
		App.animate(this.$(rowNode), 'fadeIn');
		this.adjustColumns();
	},

	selected: function(e){
		if (e) {e.preventDefault();}
		var id = this.$(e.target).closest('a').data('id');
		var model = this.collection.get(id);
		if (model){
			app.modalController.runCallerMethod(model);
		}
	},
});