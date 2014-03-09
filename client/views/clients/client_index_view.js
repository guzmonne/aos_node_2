App.Views.ClientIndexView = App.Views.BaseView.extend({
	template: HBS.client_index_template,
	className: "row",

	afterRender: function(){
		this.oTable = this.$('#clients-table').dataTable();
	},
});