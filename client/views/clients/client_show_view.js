App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	className: 'row',

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInDown');
		App.scrollTo('[data-view-cid='+this.cid+']');
		this.renderForm();
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt));
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt));
		return this.model.serialize();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: this.model});
		this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
	},
});