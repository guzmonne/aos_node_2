App.Views.ModalView = App.Views.BaseView.extend({
	template: HBS.modal_base_layout_template,
	
	modalOptions: {
		header      : true,
		footer      : true,
		customFooter: false,
		title       : '',
		modalClass  : false,
	},

	initialize: function(){
		if (!this.bodyView){return;}
		if (this.bodyView.modalOptions){_.extend(this.modalOptions, this.bodyView.modalOptions);}
	},

	attributes: function(){
		return {
			'class'          : "modal fade",
			'tabindex'       : "-1",
			'role'           : "dialog",
			'aria-labelledby': this.name,
			'aria-hidden'    : true,
			'id'             : 'modalContainer',
		};
	},

	afterRender: function(){
		this.bodyView.attachTo('.modal-body', {method: 'html'});
	},
	
	serialize: function(){
		return this.modalOptions;
	}
});