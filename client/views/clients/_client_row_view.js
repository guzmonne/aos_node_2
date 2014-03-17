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

	events: {
		'click #show-client': 'showClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
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

	showClient: function(){
		var exists = false;
		var self   = this;
		var view;
		_.each(app.children, function(portletView){
			if (App.defined(portletView.view) && 
					App.defined(portletView.view.model) && 
					portletView.view.model.id === self.model.id
			){
				exists = true;
				view   = portletView;
			}
		});
		if (exists === false) {
			var clientShowView = new App.Views.PortletView({
				viewName         : 'ClientShowView', 
				viewModel        : this.model,
				portletFrameClass: 'green',
				entrance         : 'fadeInUp',
			});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.ClientIndexView.el, method: 'before'});
		} else {
			App.scrollTo(view.el);
		}
	},
});