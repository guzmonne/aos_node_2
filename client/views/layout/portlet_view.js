App.Views.PortletView = App.Views.BaseView.extend({
	template: HBS.portlet_template,

	className: "row",

	view             : null,
	viewName         : null,
	viewModel        : null,
	portletFrameClass: null,
	entrance         : 'fadeInLeft',

	appEvents: {
		'portlet:message': 'message',
	},

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(options){
		this.model = new Backbone.Model();
		this.model.set('cid', this.cid);
	},

	afterRender: function(options){
		this.setFrame();
		if(App.defined(this.viewName)){
			if(this.viewModel !== null){
				this.view = new App.Views[this.viewName]({model: this.viewModel});
			} else {
				this.view = new App.Views[this.viewName]();
			}
			this.setHeader();
			this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
		}
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setHeader: function(header){
		if (App.defined(this.view.name)){
			this.$('#portlet-title-header').text(this.view.name);
		}
	},

	setFrame: function(){
		if(App.defined(this.portletFrameClass)){
			this.$('#portlet-frame').addClass('portlet-' + this.portletFrameClass);
		}
	},

	message: function(data){
		console.log(this.view.cid);
		if (!App.defined(data)){
			return;
		}
		if (this.view.cid === data.viewCid){
			var callout = new App.Views.BSCalloutView({model: new Backbone.Model(data)});
			this.attach(callout, {el: this.$('#portlet-messages'), method: 'prepend'});
		}
	},
});