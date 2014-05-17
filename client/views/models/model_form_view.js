App.Views.ModelFormView = App.Views.FormView.extend({
	template: HBS.model_form_template,
	storage : 'models',
	focus   : '[name=brand]',

	createSuccessMessage: {
		title  : 'Modelo Creado',
		message: 'El nuevo modelo se ha creado con exito.',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	updateSuccessMessage: {
		title  : 'Modelo Actualizado',
		message: 'El modelo se ha actualizado con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:model'       , function(){this.updateViewField.apply(this, ['model']);});
		this.listenTo(this.model, 'change:brand'       , function(){this.updateViewField.apply(this, ['brand']);});
		this.listenTo(this.model, 'change:category'    , function(){this.updateViewField.apply(this, ['category']);});
		this.listenTo(this.model, 'change:subcategory' , function(){this.updateViewField.apply(this, ['subcategory']);});
	},
});