App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	} 
});