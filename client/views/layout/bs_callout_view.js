App.Views.BSCalloutView = App.Views.BaseView.extend({
	template: HBS.bs_callout_template,
	data: {},

	className: "bs-callout",

	events: {
		'click .close': 'closeCallout',
		'click button': 'triggerEvent',
	},

	triggerEvent: function(e){
		var event = e.currentTarget.dataset.event;
		app.trigger(event);
	},

	afterRender: function(){
		var self      = this;
		var lifetime  = (this.data.lifetime) ? this.data.lifetime : 4000; 
		var className = (this.data.class)    ? this.data.class    : 'default';
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(lifetime > 0){
			this.timer = setTimeout(function(){
				self.dispose();
			}, lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},

	closeCallout: function(){
		if(App.defined(this.timer)){
			clearTimeout(this.timer);
		}
		this.dispose();
	},

	serialize: function(){
		return this.data;
	},
});