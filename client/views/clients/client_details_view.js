App.Views.ClientDetailsView = App.Views.BaseView.extend({
	template: HBS.client_details_template,

	className: 'row',

	initialize: function(){
		if(this.model){
			this.listenTo(this.model, 'sync', this.render);
		}
	},

	serialize: function(){
		var result       = (App.defined(this.model)) ? this.model.serialize() : {};
		var createdAt    = this.model.get('createdAt');
		var updatedAt    = this.model.get('updatedAt');
		result.createdAt = this.model.dateDDMMYYYY(createdAt);
		result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
		return result;
	},
});