App.Views.ClientNewView = App.Views.BaseView.extend({	
	name: "Nuevo Cliente",

	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: new App.Models.Client()});
		this.clientForm.attachTo(this.$el, {method: 'html'});
	},
});