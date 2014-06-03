App.Views.ModelSelectModalView = App.Views.BaseView.extend({
	template: HBS.model_select_modal_template,
	
	name      : "ModelSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Modelo",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		var self = this;
		app.modalController.$('#modalContainer').on('shown.bs.modal', function (e) {
			self.modelIndex.adjustColumns();
		});
		this.listenTo(this, 'disposing', function(){
			app.modalController.$('#modalContainer').off();
		});
		this.modelIndex = new App.Views.ModelIndexView({
			collection: app.storage.getCollection("models"),
			synced    : true,
			selection : true,
		});
		this.modelIndex.parentView = this.parentView;
		this.modelIndex.attachTo('#model-index');
	},
});