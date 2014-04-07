App.Views.ServiceRequestDetailsView = App.Views.BaseView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	afterRender: function(){
		if(
				!App.defined(this.appliancesIndex)	&& 
				App.defined(this.model)							&&
				App.defined(this.model.appliances)
		){
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection: this.model.appliances,
				portlet   : this.parent,
			});
			this.appliancesIndex.attachTo(this.$('#service-request-appliances'), {
				method: 'html'
			});
		}
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		if(result.status){
			var label;
			switch (result.status){
				case "Pendiente":
					label = "label-primary";
					break;
				case "Abierto":
					label = "label-info";
					break;
				case "Atrasaodo":
					label = "label-danger";
					break;
				case "Cerrado":
					label = "label-success";
					break;
				default:
					label = "label-default";
			}
			result.label = label;
		}
		return result;
	},
});