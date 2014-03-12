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
		App.animate(this.$el, 'fadeIn');
		App.scrollTo($('[data-view-cid='+this.cid+']').offset().top);
		this.renderForm();
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt));
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt));
		return this.model.serialize();
	},

	closeView: function(e){
		e.preventDefault();
		var self = this;
		App.animate(this.$el, 'fadeOut', function(){
			self.dispose();
			app.trigger('client:show:close', self.model.cid);
		});
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: this.model});
		this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
	},
});