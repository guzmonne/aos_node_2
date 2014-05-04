App.Views.ModelRowView = App.Views.RowView.extend({
	template : HBS.model_row_template,
	modelName: 'model',

	beforeRender: function(){
		console.log(this.model);
	}
});