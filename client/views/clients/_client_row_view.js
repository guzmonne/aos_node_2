App.Views.ClientRowView = App.Views.RowView.extend({
	template : HBS.client_row_template,
	modelName: 'client',
	
	onceRendered: function(){
		this.$el.tooltip();
	},
});