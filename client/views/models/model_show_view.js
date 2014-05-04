App.Views.ModelShowView = App.Views.TabView.extend({
	name: function(){
		if (this.model){
			return 'Equipos con modelo ' + this.model.get('model');
		}
	},
	
	modelId  : null,
	modelName: 'model',

	beforeInitialize: function(){
		_.once(this.renderEditForm);
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ModelDetailsView',
			active: true,
		},
		{
			id            : 'edit',
			title         : 'Editar Datos',
			class         : 'air-t',
			renderFunction: function(){
				this.renderEditForm();
			},
		}
	],

	renderEditForm: function(){
		this.editForm = new App.Views.ModelFormView({
			model: this.model,
			edit : true,
		});
		this.editForm.attachTo(this.$('#model-edit-'+ this.timestamp), {method: 'html'});
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},
});