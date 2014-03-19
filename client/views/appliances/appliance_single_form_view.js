App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		if (App.defined(this.model.collection)){
			this.listenTo(this.model.collection, 'appliance:deleted', this.saveAndDispose)
		}
	},

	afterRender: function(){
		this.$('[name=accesories]').tagsinput();
		App.scrollTo(this.$el);
	},

	activateTags: function(){
		this.$('.bootstrap-tagsinput').addClass('active');
	},

	deactivateTags: function(){
		this.$('.bootstrap-tagsinput').removeClass('active');
	},

	saveAndDispose: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
		this.model.set('accesories', this.$('[name=accesories]').tagsinput('items'));
		this.dispose();
	},
});