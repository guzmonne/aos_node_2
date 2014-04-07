App.Views.ModalController = App.Views.BaseView.extend({
	template: HBS.modal_base_layout_template,
	
	currentModal: null,
	header      : true,
	footer      : true,
	customFooter: false,
	title       : '',
	class       : false,

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

	displayModal: function(view){
		if(!App.defined(this.currentModal) || this.currentModal.cid !== view.cid){
			this.setCurrentModal(view);
		}	
		this.$el.modal('show');
	},

	setCurrentModal: function(view){
		if(this.currentModal){this.currentModal.dispose();}
		this.currentModal = view;
		if(view.title){this.title = view.title;}
		if(view.class){this.class = view.class;}
		this.render();
		this.attach(view, {el: '.modal-body', method: 'html'});
	},

	serialize: function(){
		var result = {
			header      : this.header,
			footer      : this.footer,
			customFooter: this.customFooter,
			title       : this.title,
			class       : this.class,
		};
		console.log(result);
		return result;
	}
});