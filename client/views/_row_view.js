App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.awake.apply(this, arguments);
		this.listenTo(this.model, 'change' , this.render);
		this.listenTo(this.model, 'remove', this.invokeRemoveRow);
	},

	afterRender: function(){
		if (this.active){this.activate();}
		app.trigger('row:rendered', this.model.id);
		this.$el.tooltip();
		if(this.parent.selection){
			this.$('a#show').remove();
			this.$('a#selected').removeClass('hide');
		}
		if(_.isFunction(this.onceRendered)){this.onceRendered();}
	},

	selected: function(){
		if(!App.defined(this.model)){return;}
		app.modalController.runCallerMethod(this.model);
	},

	serialize: function(){
		if(!App.defined(this.model)){return;}
		if (_.isFunction(this.model.serialize)){
			return this.model.serialize();
		} else {
			return this.model.toJSON();
		}
	},
});