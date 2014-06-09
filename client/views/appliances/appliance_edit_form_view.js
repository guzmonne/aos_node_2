App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template,

	editMode: false, 

	events: {
		'click ul.dropdown-menu.status li a'   : "setStatus",
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "reRender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'setRepairementType',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewField.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:technician_id'   , this.setTechnician);
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(this.model, 'change:status'          , this.changeStatus);
		this.listenTo(this.model, 'change:repairement_type', function(){
			this.updateViewField.apply(this, ['repairement_type']);
			this.setRepairementType();	
		});
		this.listenTo(app.storage.collection("techs"), 'add'   , this.fillTechnicianField);
		this.listenTo(app.storage.collection("techs"), 'remove', this.fillTechnicianField);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		this.fillTechnicianField();
		if(!this.editMode){
			this.blockForm();
			this.toggleButtons();
		}
		this.setRepairementType();
		this.changeStatus();
		this.setModelDetails();
	},

	toggleButtons: function(){
		this.$('#controls > button').toggleClass('hide');
		this.$('#select-model').toggleClass('hide');
		this.$('button#status-dropdown').attr('disabled', !this.$('button#status-dropdown').attr('disabled'));
	},

	fillTechnicianField: function(){
		var technicians = _.map(app.storage.collection("techs").models, function(model){
			return {id: model.id, name: model.get("name")};
		});
		var field = this.$('[name=technician_id]');
		field.empty();
		_.each(technicians, function(technician){
			if (!technician.id || !technician.name){return;}
			field.append(
				'<option value="'+technician.id+'">'+technician.name+'</option>'
			);
		});
		field.prepend(
				'<option value="" selected></option>'
		);
		this.setTechnician();
	},

	setRepairementType: function(){
		var repairementTypeVal = this.$('[name=repairement_type]').val();
		if (repairementTypeVal === "Presupuesto"){
			this.$('#cost-form-group').show();
		} else {
			this.$('#cost-form-group').hide();
		}
	},

	setTechnician: function(){
		var id = this.model.get('technician_id');
		if (!id || id === '') {
			this.$('[name=technician_link]').attr('disabled', true);
		} else {
			this.$('[name=technician_id]').val(id);
			this.$('[name=technician_link]').attr('href', '#render/user/show/' + id);
			this.$('[name=technician_link]').attr('disabled', false);
		}
	},

	changeStatus: function(){
		var status = this.model.get('status');
		var value  = App.statusValue[status];
		var classes = "btn btn-block dropdown-toggle btn-status btn-status-" + value;
		this.$('button#status-dropdown').removeClass().addClass(classes).text(status);
	},

	setStatus: function(e){
		if (e) {e.preventDefault();}
		var status = this.$(e.target).closest('a').text();
		this.model.set("status", status);
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
				self.model.prevModelId = self.model.get('model_id');
			}
		});
		this.editMode = false;
		this.blockForm();
		this.toggleButtons();
	},

	reRender: function(e){
		e.preventDefault();
		this.editMode = false;
		if (this.model.prevModelId){ this.model.set('model_id', this.model.prevModelId); }
		this.render();
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(), 
			'serial',
			'observations',
			'repairement_type', 
			'defect',
			'accessories',
			'replacements',
			'diagnose',
			'solution',
			'technician_id',
			'repairement_type',
			'cost'
		));
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});