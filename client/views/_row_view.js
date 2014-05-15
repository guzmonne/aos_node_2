App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.listenTo(this.model, 'change' , this.render);
		this.listenTo(app, 'model:show:active',   this.activate);
		this.listenTo(app, 'model:show:inactive', this.deactivate);
		_.debounce(this.render, 100);
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

	activate: function(id){
		if(this.model && this.model.id !== id){return;}
		this.activated = true;
		this.$el.addClass('selected');
	},

	deactivate: function(id){
		if(this.model && this.model.id !== id){return;}
		if(this.$el.hasClass('selected')){
			this.activated = false;
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});