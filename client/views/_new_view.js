App.Views.NewView = App.Views.BaseView.extend({
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		if(!App.defined(this.formViewName)){return new Error('formViewName not defined');}
		this.formView = new App.Views[this.formViewName]({
			model: this.model,
		});
		this.formView.attachTo(this.$el, {method: 'html'});
		this.model = undefined;
	},
});