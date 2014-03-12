App.Views.BaseView = Giraffe.View.extend({
	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 1){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

	closeView: function(e){
		e.preventDefault();
		var self = this;
		App.animate(this.$el, 'fadeOut', function(){
			self.dispose();
			if(self.model !== undefined && self.model !== null){
				app.trigger('client:show:close', self.model.cid);
			} else {
				app.trigger('client:show:close');
			}
		});
	},
});