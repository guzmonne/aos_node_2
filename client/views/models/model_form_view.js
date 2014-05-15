App.Views.ModelFormView = App.Views.BaseView.extend({
	template: HBS.model_form_template,

	edit  : false,
	editOn: false,

	events: {
		'submit form'             : 'submitForm',
		'click button#reset-model': 'reRender',
		'click button#edit-model' : 'editModel',
	},

	initialize: function(){
		_.once(this.editForm);
		_.once(this.newForm);
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

	submitForm: function(e){
		if (e){e.preventDefault();}
		if (this.edit){
			this.updateModel();
		} else {
			this.createModel();
		}
	},

	editModel: function(e){
		if (e){e.preventDefault();}
		this.editOn = (this.editOn) ? false : true;
		if (this.editOn){
			this.unblockForm();
		} else {
			this.blockForm();
		}
		this.$('.btn').toggleClass('hide');
	},

	updateModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', {
					title  : 'Modelo Actualizado',
					message: 'El modelo se ha actualizado con exito',
					class  : 'success',
				});
			},
			error: function(model){
				self.invoke('showMessage', {
					title  : 'Error',
					message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
					class  : 'danger',
				});
			}
		});
		this.editModel();
	},

	createModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', {
					title  : 'Modelo Creado',
					message: 'El nuevo modelo se ha creado con exito.',
					class  : 'success',
				});
			},
			error: function(model){
				self.invoke('showMessage', {
					title  : 'Error',
					message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
					class  : 'danger',
				});
			}
		});
		this.model.dispose();
		this.model = app.storage.newModel("models");
		this.cleanForm();
	},

	saveModel: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
	},

	cleanForm: function(){
		this.$('[name=brand]').val('');
		this.$('[name=model]').val('');
		this.$('[name=category]').val('');
		this.$('[name=subcategory]').val('');
	}
});