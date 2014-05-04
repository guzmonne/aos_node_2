App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template,

	editMode: false, 

	events: {
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "reRender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'changeRepairementType',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
		this.listenTo(this.model, 'sync'   , this.render);
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'exchangeModel');
		this.$el.on('click', 'button#select-model', this.selectModel);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		if(!this.editMode){
			this.blockForm();
			this.toggleButtons();
		}
		this.changeRepairementType();
	},

	toggleButtons: function(){
		this.$('button').toggleClass('hide');
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
				self.invoke('showMessage', {
					title  : 'Equipo Actualizado',
					message: 'El equipo se ha actualizado con exito',
					class  : 'success',
				});
			}
		});
		this.model.modelUpdated();
		this.editMode = false;
	},

	reRender: function(e){
		e.preventDefault();
		this.editMode = false;
		if (this.tempModel){
			this.exchangeModel(this.tempModel);
			this.tempModel.dispose();
		}
		this.render();
	},

	saveModel: function(){
		this.model.set('serial'      , this.$('[name=serial]').val()      , {silent: true});
		this.model.set('observations', this.$('[name=observations]').val(), {silent: true});
		// If the repairement type has change and equals "Garantía" then the cost = 0
		if(
			this.model.get('repairement_type') !== this.$('[name=repairement_type]').val() &&
			this.$('[name=repairement_type]').val() === 'Garantía'
		){
			this.model.set('cost', 0, {silent: true});
		} else {
			this.model.set('cost', this.$('[name=cost]').val(), {silent: true});
		}
		this.model.set('repairement_type', this.$('[name=repairement_type]').val()        , {silent: true});
		this.model.set('defect'          , this.$('[name=defect]').val()                  , {silent: true});
		this.model.set('accessories'     , this.$('[name=accessories]').tagsinput('items'), {silent: true});
		this.model.set('status'          , this.$('[name=status]').val()                  , {silent: true});
		this.model.set('replacements'    , this.$('[name=replacements]').val()            , {silent: true});
		this.model.set('diagnose'        , this.$('[name=diagnose]').val()                , {silent: true});
		this.model.set('solution'        , this.$('[name=solution]').val()                , {silent: true});
		this.model.set('technician_id'   , this.$('[name=technician_id]').val()           , {silent: true});
	},

	beforeDispose: function(){
		this.$el.off('click', 'button#select-model');
	},
});