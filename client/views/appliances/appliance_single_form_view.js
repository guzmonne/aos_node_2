App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.Appliance();
		}
		var collection = this.model.collection;
		if (App.defined(collection)){
			this.listenTo(collection, 'appliance:deleted', this.saveAndDispose);
		}
		_.extend(this, App.Mixins.SelectModel);
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'exchangeModel');
		this.$el.on('click', 'button#select-model', this.selectModel);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=serial]').focus();
	},

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set('serial'          , this.$('[name=serial]').val());
		this.model.set('observations'    , this.$('[name=observations]').val());
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect'          , this.$('[name=defect]').val());
		this.model.set('accessories'     , this.$('[name=accessories]').tagsinput('items'));
	},

	beforeDispose: function(){
		this.$el.off('click', 'button#select-model');
		Giraffe.View.prototype.beforeDispose.apply(this, arguments);
	},
});