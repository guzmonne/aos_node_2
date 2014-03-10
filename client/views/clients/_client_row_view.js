App.Views.ClientRowView = App.Views.BaseView.extend({
	template : HBS.client_row_template,

	tagName  : 'tr',

	ui: {
		$showClient: '#show-client',
	},

	appEvents: {
		'client:show:close': 'deactivate',
	},

	events: {
		'mouseover'         : 'showControls',
		'mouseout'          : 'hideControls',
		'click #show-client': 'showClient',
	},

	serialize: function(){
		return this.model.toJSON();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.$el.addClass('selected');
		this.app.trigger('client_row:selected', this.cid);
	},

	deactivate: function(cid){
		if(cid === this.model.cid && this.$el.hasClass('selected')){
			this.$el.removeClass('selected');
		}
	},

	showClient: function(){
		var exists = false;
		var self   = this;
		_.each(app.children, function(view){
			if (view.model !== undefined && (view.model.cid === self.model.cid)){
				exists = true;
			}
		});
		if (exists === false) {
			var clientShowView = new App.Views.ClientShowView({model: this.model});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.clientIndex.el, method: 'before'});
			this.activate();
		}
	},
});