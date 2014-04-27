App.Views.ModelSelectModalView = App.Views.BaseView.extend({
	template: HBS.model_select_modal_template,
	
	name      : "ModelSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Modelo",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.modelIndex = new App.Views.ModelIndexView();
		this.modelIndex.selection  = true;
		this.modelIndex.parentView = this.parentView;
		this.modelIndex.attachTo('#model-index');
	},
});