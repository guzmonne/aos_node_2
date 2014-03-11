App.Views.ClientNewView = App.Views.BaseView.extend({
	template            : HBS.client_new_template,
	
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: new App.Models.Client()});
		this.clientForm.attachTo(this.$('#client-form'), {method: 'html'});
	},
});