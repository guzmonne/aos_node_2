App.Views.FormView = App.Views.BaseView.extend({
	edit  : false,
	editOn: false,
	focus : '',

	createSuccessMessage: {
		title  : 'Exito',
		message: 'Se han guardado los datos con exito',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},
	
	updateSuccessMessage: {
		title  : 'Exito',
		message: 'Se han actualizado los cambios con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	constructor: function(){
		if (this.formEvents){
			_.extend(this.events, this.formEvents);
		}
		App.Views.BaseView.apply(this, arguments);
	},

	initialize: function(){
		this.awake.apply(this, arguments);
		this.bindEvents.apply(this, arguments);
		_.once(this.editForm);
		_.once(this.newForm);
	},

	bindEvents: function(){},
	awake: function(){},

	events: {
		'submit form'             : 'submitForm',
		'click button#reset-model': 'reRender',
		'click button#edit-model' : 'editModel',
		'click .checkbox label'   : 'toggleCheckBox',
	},

	reRender: function(e){
		if (e){e.preventDefault();}
		this.editOn = false;
		this.render();
	},

	afterRender: function(){
		if (this.edit){
			this.editForm();
		} else {
			this.newForm();
		}
	},

	newForm: function(){
		this.$('#edit-model').remove();
	},

	editForm: function(){
		this.$('#save-model').remove();
		this.blockForm();
	},

	editModel: function(e){
		if (e){e.preventDefault();}
		this.editOn = (this.editOn) ? false : true;
		if (this.editOn){
			this.unblockForm();
			this.$(this.focus).focus();
		} else {
			this.blockForm();
		}
		this.$('.btn').toggleClass('hide');
	},

	submitForm: function(e){
		if (e){e.preventDefault();}
		if (this.edit){
			this.updateModel();
		} else {
			this.createModel();
		}
	},

	createModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.createSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.createErrorMessage);
			}
		});
		this.model = app.storage.newModel(self.storage);
		this.bindEvents();
		this.cleanForm();
	},

	updateModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.updateSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.updateErrorMessage);
			}
		});
		this.editModel();
	},

	saveModel: function(){
		this.model.set(this.$('form').formParams());
	},

	cleanForm: function(){
		this.$('input').val('');
		this.$('textare').text('');
		this.$('input[type=checkbox]').val(false);
		this.$('input[type=radio]').val(false);
		this.$(this.focus).focus();
	},

	toggleCheckBox: function(e){
		var name     = e.target.htmlFor;
		var checkbox = this.$('[name='+name+']');
		if (checkbox.attr("disabled")){return;}
		checkbox.prop("checked", !checkbox.prop('checked'));
	},
});