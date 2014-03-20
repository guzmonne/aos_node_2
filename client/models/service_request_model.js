App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	initialize: function(attributes, options){
		if (App.defined(attributes)){
			this.parseAttributes(attributes);
		}
	},

	defaults: function(){
		return {
			'client_name'   : null,
			'client_id'     : null,
			'status'        : 'Pendiente',
			'createdAt'     : null,
			'updatedAt'     : null,
			'invoiceNumber' : null,
			'appliances'    : new App.Collections.Appliances(),
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
			'closedAt'			: null,
		};
	},

	parse: function(response){
		if (this.id){
			if (App.defined(response.appliances)){
				this.setAppliances(response.appliances);
			}
			return response; 
		} else {
			return response;
		}
	},

	parseAttributes: function(response){
		this.setAppliances(response.appliances);
		return response;
	},

	setAppliances: function(array){
		if(!App.defined(array)){
			array = this.get('appliances');
		}
		if (_.isArray(array)){
			this.set('appliances', new App.Collections.Appliances(array), {silent: true});
		}
		return this;
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(attributes.appliances instanceof(Giraffe.Collection)){
			attributes.appliances = attributes.appliances.toJSON();
		}
		return attributes;
	},
});