// !!!
// Type: Mixin
// -----
// Description:
// ------------
// Mixin that adds the necessary functions to announce the entrance or exit of a show view.
// The show views extend this mixin to let the row views if they are called or are disposed.
// ------------ 
// !!!
App.Mixins.ShowViewAnnouncer = {
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
		this.model.trigger('model:show:inactive');
	},
};