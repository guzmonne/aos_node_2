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
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:status'          , function(){this.updateViewField.apply(this, ['status']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:repairement_type', function(){this.updateViewField.apply(this, ['repairement_type']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewText.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
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
		this.model.save(null, {
			success: function(){
				self.invoke('showMessage', {
					title  : 'Equipo Actualizado',
					message: 'El equipo se ha actualizado con exito',
					class  : 'success',
				});
			}
		});
		this.editMode = false;
		this.blockForm();
		this.toggleButtons();
	},

	reRender: function(e){
		e.preventDefault();
		this.editMode = false;
		if (this.model._previousAttributes.model_id){
			this.model.set('model_id', this.model._previousAttributes.model_id);
		}
		this.render();
	},

	saveModel: function(){
		this.setRepType();
		this.model.set(_.pick(this.$('form').formParams(), 
			'serial',
			'observations',
			'repairement_type', 
			'defect',
			'accessories',
			'status',
			'replacements',
			'dispose',
			'solution',
			'technician_id'
		));
	},

	setRepType: function(){
		var oldRepType = this.model.get('repairement_type');
		var newRepType = this.$('[name=repairement_type]').val();
		if((oldRepType !== newRepType) && (newRepType === "Garantía")){
			this.model.set('cost', 0);
		} else {
			this.model.set('cost', this.$('[name=cost]').val());
		}
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});