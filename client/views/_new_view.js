App.Views.NewView = App.Views.BaseView.extend({
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.formView = new App.Views[this.formViewName]({
			model: new App.Models[this.modelName]()
		});
		this.formView.attachTo(this.$el, {method: 'html'});
	},
});