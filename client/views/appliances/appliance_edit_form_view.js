App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template, 

	className: "row",

	events: {
		'click #edit-appliance'              : "editAppliance",
		'click #save-appliance'              : "saveAppliance",
		'click #render-appliance'            : "rerender",
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.blockForm();
		this.toggleButtons();
	},

	toggleButtons: function(){
		this.$('button').toggleClass('hide');
	},

	editAppliance: function(e){
		e.preventDefault();
		this.unblockForm();
		this.toggleButtons();
	},

	saveAppliance: function(e){
		e.preventDefault();
		this.saveModel();
		this.model.save();
		this.blockForm();
		this.toggleButtons();
	},

	rerender: function(e){
		e.preventDefault();
		this.render();
	},

	serialize: function(){
		return this.model.toJSON();
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