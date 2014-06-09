App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		var self = this;
		this.clientIndex = new App.Views.ClientIndexView({
			collection: app.storage.getCollection("clients"),
			synced    : true,
			selection : true,
		});
		this.clientIndex.attachTo('#client-index');
	},
});