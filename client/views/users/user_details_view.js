App.Views.UserDetailsView = App.Views.ShowView.extend({
	template: HBS.user_details_template,
	className: 'row',

	afterRender: function(){
		this.invoke('setHeader');
		this.listenTo(this.model, 'sync', this.render);
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});