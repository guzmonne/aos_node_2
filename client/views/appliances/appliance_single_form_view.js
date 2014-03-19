App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		if (App.defined(this.model.collection)){
			this.listenTo(this.model.collection, 'appliance:deleted', this.saveAndDispose);
		}
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInDown');
		this.$('[name=accesories]').tagsinput();
		if(this.firstRender){
			App.scrollTo(this.$el);
			this.firstRender = false;
		}
	},

	activateTags: function(){
		this.$('.bootstrap-tagsinput').addClass('active');
	},

	deactivateTags: function(){
		var input = this.$('.bootstrap-tagsinput input');
		var value = input.val();
		if (value !== ''){
			this.$('[name=accesories]').tagsinput('add', value);
			input.val('');
		}
		this.$('.bootstrap-tagsinput').removeClass('active');
	},

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
		this.model.set('observations', this.$('[name=observations]').val());
		this.model.set('repairementType', this.$('[name=repairementType]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accesories', this.$('[name=accesories]').tagsinput('items'));
	},
});