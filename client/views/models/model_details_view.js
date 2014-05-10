App.Views.ModelDetailsView = App.Views.ShowView.extend({
	template: HBS.model_details_template,
	className: 'row',

	awake: function(){
		_.once(this.renderApplianceIndex);
	},

	afterRender: function(){
		this.renderApplianceIndex();
		this.invoke('setHeader');
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model)){return;}
		var el = this.$('#model-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			collection   : this.model.appliances,
			fetchOnRender: false,
			baseModel    : this.model,
		});
		this.appliancesIndex.attachTo(el, {method: 'html'});
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});