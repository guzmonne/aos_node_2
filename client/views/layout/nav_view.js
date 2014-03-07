App.Views.NavView = Giraffe.View.extend({
	template: HBS.nav_template,

	tagName: 'nav',
	attributes: function(){
		return {
			'class': "navbar navbar-inverse navbar-static-top",
			'role': "navigation", 
			'style': "margin-bottom: 0" 
		};
	},

});