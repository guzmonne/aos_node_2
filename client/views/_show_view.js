App.Views.ShowView = App.Views.BaseView.extend({

	initialize: function(){
		this.awake.apply(this, arguments);
		this.listenTo(app , 'row:rendered', this.checkEventCaller);
		this.listenTo(this, 'disposing'   , this.modelShowInactive);
		this.modelShowActive();
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
		if(!this.model){return;}
		app.trigger('model:show:active', this.model.id);
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
		if(!this.model){return;}
		app.trigger('model:show:inactive', this.model.id);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Checks if the event emitter has the same model as we do
	// ------------ 
	// Arguments:
	// ----------
	// id [String]: id of the model handled by the event emmiter. If it is the same
	// as ours then we emit the show active event.
	// ----------
	// !!!
	checkEventCaller: function(id){
		if (id === this.model.id){
			this.modelShowActive();
		}
	},
});