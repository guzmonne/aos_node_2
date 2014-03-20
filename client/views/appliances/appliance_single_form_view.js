App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.Appliance();
		}
		var col = this.model.collection;
		if (App.defined(col)){
			this.listenTo(col, 'appliance:deleted', this.saveAndDispose);
			this.listenTo(col, 'service_request:create:success', this.dispose);
		}
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInDown');
		this.$('[name=accessories]').tagsinput();
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
			this.$('[name=accessories]').tagsinput('add', value);
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
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'));
	}, 
});