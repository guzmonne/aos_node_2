App.Views.BSCalloutView = App.Views.BaseView.extend({
	template: HBS.bs_callout_template,

	className: "bs-callout",

	lifetime: 3000,

	events: {
		'click .close': 'closeView',
	},

	afterRender: function(){
		var self = this;
		var className = this.model.get('class');
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(this.lifetime > 0){
			this.timer = setTimeout(function(){
				self.closeView();
			}, this.lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},
});