App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'submit form'                        : function(e){e.preventDefault();},
		//'focus .bootstrap-tagsinput input'   : 'activateTags',
		//'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:status'          , function(){this.updateViewField.apply(this, ['status']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:repairement_type', function(){this.updateViewField.apply(this, ['repairement_type']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewText.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(this, 'disposing', this.removeTagsinput);
	},

	afterRender: function(){
		this.tagsinput();
		this.$('[name=serial]').focus();
	},

	tagsinput: function(){
		var self = this;
		this.removeTagsinput();
		this.$('[name=accessories]').tagsinput();
		this.$('.bootstrap-tagsinput input').on("focus"   , function(e){ self.activateTags(e); });
		this.$('.bootstrap-tagsinput input').on("focusout", function(e){ self.deactivateTags(e); });
	},

	removeTagsinput: function(){
		this.$('.bootstrap-tagsinput input').off('focus');
		this.$('.bootstrap-tagsinput input').off('focusout');
		this.$('.bootstrap-tagsinput').remove();
	}, 

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'serial',
			'observations',
			'repairement_type',
			'defect'
		));
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'), {silent: true});
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});