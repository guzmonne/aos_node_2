App.Views.ClientRowView = App.Views.BaseView.extend({
	name: "App.Views.ClientRowView",
	template: HBS.client_row_template,
	tagName: 'tr',

	appEvents: {
		'client_row:selected': 'deactivate'
	},

	events: {
		'click' : 'activate',
	},

	serialize: function(){
		return this.model.toJSON();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.$el.addClass('selected');
		this.app.trigger('client_row:selected', this.cid);
	},

	deactivate: function(cid){
		if(cid !== this.cid && this.$el.hasClass('selected')){
			this.$el.removeClass('selected');
		}
	},
});