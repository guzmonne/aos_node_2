App.Views.ServiceRequestDetailsView = App.Views.BaseView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	initialize: function(){
		if (this.model){
			this.listenTo(this.model, 'change', this.render);
		}
		this.counter = 0;
	},

	afterRender: function(){
		this.counter = this.counter + 1;
		console.log(this.counter);
		if(
				!App.defined(this.appliancesIndex)	&& 
				App.defined(this.model)							&&
				App.defined(this.model.appliances)	&&
				this.model.appliances.length > 0
		){
			this.model.appliances.client_id = this.model.id;
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection: this.model.appliances,
			});
			this.appliancesIndex.attachTo(this.$('#service-request-appliances'), {
				method: 'html'
			});
		}
		this.parent.setName();
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