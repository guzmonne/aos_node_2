App.Views.ClientRowView = App.Views.BaseView.extend({
	template : HBS.client_row_template,

	tagName  : 'tr',

	activated  : false,

	ui: {
		$showClient: '#show-client',
	},

	appEvents: {
		'client:show:close' : 'deactivate',
		'client:show:active': 'activateRenderedViews', 
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
		this.listenTo(this.model, 'change', this.render);
	},

	afterRender: function(){
		if(this.activated){
			this.activate();
		}
		app.trigger('client:row:rendered');
	},

	serialize: function(){
		return this.model.serialize();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.activated = true;
		this.$el.addClass('selected');
	},

	activateRenderedViews: function(id){
		if(this.model.id === id){
			this.activate();
		}
	},

	deactivate: function(id){
		if(id === this.model.id && this.$el.hasClass('selected')){
			this.activated = false;
			this.$('#show-client>i').removeClass('fa-spin');
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});