App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
		'click button#select-model'          : 'selectModel',
	},

	appEvents: {
		'model:selected': 'modelSelected',
	},

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.Appliance();
		}
		var col = this.model.collection;
		if (App.defined(col)){
			this.listenTo(col, 'appliance:deleted', this.saveAndDispose);
			this.listenTo(col, 'service_request:create:success', this.dispose);
		}
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=serial]').focus();
	},

	modelSelected: function(data){
		if(data.parentView !== this.cid){return;}
		var attrs = _.pick(data.model.attributes,  
			'brand', 
			'model', 
			'category', 
			'subcategory'
		);
		attrs.model_id = data.model.get('_id'); 
		this.model.set(attrs);
		this.render();
	},

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('observations', this.$('[name=observations]').val());
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'));
	}, 

	selectModel: function(){
		if(!this.modelSelectModalView){
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
			this.modelSelectModalView.parentView = this.cid;
		}
		app.modalController.displayModal(this.modelSelectModalView);
	},
});