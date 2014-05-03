App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template,

	editMode: false, 

	events: {
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "rerender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'changeRepairementType',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize');
		this.$el.on('click', 'button#select-model', this.selectModel);
		console.log(this.model.cid);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		if(!this.editMode){
			this.blockForm();
			this.toggleButtons();
		}
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
		this.editMode = true;
	},

	saveAppliance: function(e){
		var self    = this;
		e.preventDefault();
		this.saveModel();
		this.model.save({}, {
			success: function(){
				var options = {
					title  : 'Equipo Actualizado',
					message: 'El equipo se ha actualizado con exito',
					class  : 'success'
				};
				var view = new App.Views.BSCalloutView({
					model: new Giraffe.Model(options)
				});
				view.attachTo(self.$('#message'), {method: 'html'});
			}
		});
		this.blockForm();
		this.toggleButtons();
	},

	rerender: function(e){
		e.preventDefault();
		this.editMode = false;
		this.render();
	},

	saveModel: function(){
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('observations', this.$('[name=observations]').val());
		// If the repairement type has change and equals "Garantía" then the cost = 0
		if(
			this.model.get('repairement_type') !== this.$('[name=repairement_type]').val() &&
			this.$('[name=repairement_type]').val() === 'Garantía'
		){
			this.model.set('cost', 0);
		} else {
			this.model.set('cost', this.$('[name=cost]').val());
		}
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'));
		this.model.set('status', this.$('[name=status]').val());
		this.model.set('replacements', this.$('[name=replacements]').val());
		this.model.set('diagnose', this.$('[name=diagnose]').val());
		this.model.set('solution', this.$('[name=solution]').val());
		this.model.set('technician_id', this.$('[name=technician_id]').val());
	},

	beforeDispose: function(){
		this.$el.on('click', 'button#select-model');
	},
});