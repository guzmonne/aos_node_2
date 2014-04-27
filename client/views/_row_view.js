App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,
	

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(app, this.modelName + ":show:close", this.deactivate);
		this.listenTo(app, this.modelName + ":show:active", this.activateRenderedViews);
	},

	afterRender: function(){
		if(this.activated){
			this.activate();
		}
		app.trigger(this.modelName + ':row:rendered');
		this.$el.tooltip();
		if(this.parent.selection){
			this.$('a#show').remove();
			this.$('a#selected').removeClass('hide');
		}
		if(_.isFunction(this.onceRendered)){this.onceRendered();}
	},

	selected: function(){
		var data;
		if(this.parent.parentView){
			data = {
				model     : this.model,
				parentView: this.parent.parentView
			};
		} else {
			data = this.model;
		}
		app.trigger(this.modelName + ':selected', data);
		app.modalController.closeModal();
	},

	serialize: function(){
		if(!App.defined(this.model)){return;}
		if (_.isFunction(this.model.serialize)){
			return this.model.serialize();
		} else {
			return this.model.toJSON();
		}
	},

	activate: function(e){
		this.activated = true;
		this.$el.addClass('selected');
	},

	activateRenderedViews: function(id){
		if(this.model.id === id){
			this.activate();
		}
	},

	deactivate: function(id){
		if(id === this.model.id && this.$el.hasClass('selected')){
			this.activated = false;
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});