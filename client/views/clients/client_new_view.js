App.Views.ClientNewView = App.Views.BaseView.extend({
	template            : HBS.client_new_template,
	
	className: "row",

	events: {
		'click #client-close' : 'closeView',
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInLeft');
		this.$el.tooltip();
		this.renderForm();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: new App.Models.Client()});
		this.clientForm.attachTo(this.$('#client-form'), {method: 'html'});
	},
});