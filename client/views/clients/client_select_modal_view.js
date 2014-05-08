App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		var collection   = new App.Collections.Clients();
		this.clientIndex = new App.Views.ClientIndexView({
			fetchOnRender: true,
			collection   : collection,
		});
		this.clientIndex.selection = true;
		this.clientIndex.attachTo('#client-index');
	},
});