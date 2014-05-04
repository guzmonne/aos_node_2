App.Views.ModalController = App.Views.BaseView.extend({
	currentModal: null,
	callerView  : null,
	callerMethod: null,

	tagName     : 'section',
	id          : 'modal-el',
	
	events: {
		'click .close-modal': 'closeModal',
	},

	displayModal: function(view, callerView, callerMethod){
		if (callerView)   {this.callerView   = callerView;}
		if (callerMethod) {this.callerMethod = callerMethod;}
		if(!App.defined(this.currentModal) || this.currentModal.bodyView.cid !== view.cid){
			this.setCurrentModal(view);
		}	
		this.$('#modalContainer').modal('show');
	},

	setCurrentModal: function(view){
		this.currentModal = new App.Views.ModalView({bodyView: view});
		this.attach(this.currentModal, {el: this.el, method: 'html'});
	},

	closeModal: function(){
		this.$('#modalContainer').modal('hide');
		this.callerView   = null;
		this.callerMethod = null;
	},

	runCallerMethod: function(data){
		if(!App.defined(this.callerView) || !App.defined(this.callerMethod)){return;}
		var method = this.callerView[this.callerMethod];
		if(!_.isFunction(method)){return;}
		method.call(this.callerView, data);
		this.closeModal();
	},
});