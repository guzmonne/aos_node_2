App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template, 

	className: "row",

	events: {
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "rerender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'changeRepairementType',
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		this.blockForm();
		this.toggleButtons();
		this.changeStatus();
		this.changeRepairementType();
	},

	toggleButtons: function(){
		this.$('button').toggleClass('hide');
	},

	changeStatus: function(){
		var statusSelect = this.$('[name=status]');
		var viewStatus = statusSelect.val();
		var statusClass;
		switch (viewStatus){
			case "Pendiente":
				statusClass = "status-pending";
				break;
			case "Atrasado":
				statusClass = "status-late";
				break;
			case "Abierto":
				statusClass = "status-opened";
				break;
			case "Cerrado":
				statusClass = "status-closed";
				break;
			default:
				statusClass = "status-pending";
				break;
		}
		this.$('[name=status]').closest('.form-group').removeClass().addClass("form-group " + statusClass);
	},

	changeRepairementType: function(){
		var repairementTypeVal = this.$('[name=repairement_type]').val();
		if (repairementTypeVal === "Garantía"){
			this.$('#cost-form-group').hide();
		} else {
			this.$('#cost-form-group').show();
		}
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
		this.model.set('status', this.$('[name=status]').val());
		this.model.set('cost', this.$('[name=cost]').val());
		this.model.set('replacements', this.$('[name=replacements]').val());
		this.model.set('diagnose', this.$('[name=diagnose]').val());
		this.model.set('solution', this.$('[name=solution]').val());
		this.model.set('technician_id', this.$('[name=technician_id]').val());
	},
});