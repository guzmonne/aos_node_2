App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	name    : null,

	appEvents: {
		"client:index:render": 'announce',
	},

	initialize: function(){
		this.name = 'Cliente: ' + this.model.get('name') + ' #' + this.model.id;
	},

	afterRender: function(){
		this.listenTo(this.model, 'updated', this.parent.render);
		App.scrollTo(this.parent.el);
		this.announce();
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

	announce: function(){
		app.trigger('client:show:active', this.model.cid);
	},

	beforeDispose: function(){
		app.trigger('client:show:close', this.model.cid);
	},
});