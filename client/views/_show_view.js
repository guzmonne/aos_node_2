App.Views.ShowView = App.Views.BaseView.extend({
	initialize: function(){
		if (!this.model){return;}
		this.listenTo(this.model, 'sync', this.update);
		this.listenTo(this.model, 'row:rendered', this.modelShowActive);
		this.modelShowActive();
		if(_.isFunction(this.afterInitialize)){this.afterInitialize();}
	},

	update: function(){
		this.render();
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowActive: function(){
		if (!this.model){return;}
		this.model.trigger('model:show:active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowInactive: function(){
		if (!this.model){return;}
		this.model.trigger('model:show:inactive');
	},

	beforeDispose: function(){
		if (!this.model){return;}
		this.modelShowInactive();
	},
});