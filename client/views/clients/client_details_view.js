App.Views.ClientDetailsView = App.Views.BaseView.extend({
	template: HBS.client_details_template,

	className: 'row',

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.serialize() : {};
		var createdAt  = this.model.get('createdAt');
		var updatedAt  = this.model.get('updatedAt');
		result.createdAtShort = this.model.dateDDMMYYYY(createdAt);
		result.updatedAtShort = this.model.dateDDMMYYYY(updatedAt);
		return result;
	},
});