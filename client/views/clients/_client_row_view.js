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
		'click #show-client': 'showClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
	},

	serialize: function(){
		return this.model.serialize();
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
		var cid;
		_.each(app.children, function(view){
			if (view.model !== undefined && (view.model.cid === self.model.cid)){
				exists = true;
				cid    = view.cid;
			}
		});
		if (exists === false) {
			var clientShowView = new App.Views.ClientShowView({model: this.model});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.clientIndex.el, method: 'before'});
			this.activate();
		} else {
			App.scrollTo($('[data-view-cid='+cid+']').offset().top);
		}
	},
});