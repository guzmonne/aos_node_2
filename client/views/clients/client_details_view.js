App.Views.ClientDetailsView = App.Views.ShowView.extend({
	template: HBS.client_details_template,

	className: 'row',

	awake: function(){
		this.listenTo(this.model, 'sync', this.render);
	},

	afterRender: function(){
		this.invoke('setHeader');
	},

	serialize: function(){
		var result       = (App.defined(this.model)) ? this.model.toJSON() : {};
		var createdAt    = this.model.get('createdAt');
		var updatedAt    = this.model.get('updatedAt');
		result.createdAt = this.model.dateDDMMYYYY(createdAt);
		result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
		return result;
	},
});