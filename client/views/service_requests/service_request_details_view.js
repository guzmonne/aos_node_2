App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	afterInitialize: function(){
		_.once(this.renderApplianceIndex);
	},

	afterRender: function(){
		if (App.defined(this.model) && this.model.hasChanged()){
			this.renderApplianceIndex();
		}
		this.invoke('setHeader');
	},

	renderApplianceIndex: function(){
		var el = this.$('#service-request-appliances');
		if(!this.appliancesIndex){
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection     : this.model.appliances,
				fetchOnRender  : false,
				disposeOnDetach: false,
			});
		}
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