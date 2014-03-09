App.Views.BaseView = Giraffe.View.extend({
	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 0){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},
});