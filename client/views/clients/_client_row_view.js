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
		if (this.activated){
			this.spinGear();
		}
	},

	serialize: function(){
		return this.model.serialize();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.activated = true;
		this.$('#show-client>i').addClass('fa-spin');
		this.$el.addClass('selected');
	},

	activateRenderedViews: function(cid){
		if(this.model.cid === cid){
			this.activate();
		}
	},

	deactivate: function(cid){
		if(cid === this.model.cid && this.$el.hasClass('selected')){
			this.activated = false;
			this.$('#show-client>i').removeClass('fa-spin');
			this.$el.removeClass('selected');
		}
	},

	showClient: function(){
		var exists = false;
		var self   = this;
		var view;
		_.each(app.children, function(portletView){
			if (App.defined(portletView.view) && 
					App.defined(portletView.view.model) && 
					portletView.view.model.cid === self.model.cid
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
			});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.ClientIndexView.el, method: 'before'});
			this.activate();
		} else {
			console.log(view);
			App.scrollTo(view.el);
		}
	},
});