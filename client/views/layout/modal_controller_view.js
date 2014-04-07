App.Views.ModalController = App.Views.BaseView.extend({
	currentModal: null,

	tagName: 'section',
	id     : 'modal-el',

	displayModal: function(view){
		if(!App.defined(this.currentModal) || this.currentModal.bodyView.cid !== view.cid){
			this.setCurrentModal(view);
		}	
		this.$('#modalContainer').modal('show');
	},

	setCurrentModal: function(view){
		if(this.currentModal){this.currentModal.dispose();}
		this.currentModal = new App.Views.ModalView({bodyView: view});
		this.attach(this.currentModal, {el: this.el, method: 'html'});
	},
});