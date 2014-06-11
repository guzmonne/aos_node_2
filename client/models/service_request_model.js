App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	defaults: function(){
		return {
			'status'        : 'Pendiente',
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
		};
	},

	awake: function(){
		this.listenTo(this, 'change:repairement_type', this.checkCost);
		this.listenTo(this, 'sync', this.setRelatedFields);
		this.listenTo(this, 'add' , this.setRelatedFields);
	},

	setRelatedFields: function(){
		this.setClientName();
		this.setAppliancesCount();
		this.setInvoiceNumber();
		this.setDates();
	},

	setAppliancesCount: function(){
		var appliances = this.get('appliances');
		var length = (_.isArray(appliances)) ? appliances.length: 0;
		this.set('appliancesCount', length);
	},

	setClientName: function(){
		this.setRelatedField('clients', 'client_id', 'name', 'client_name');
	},

	setInvoiceNumber: function(){
		this.cleanField('invoiceNumber');
	},

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliancesCount = this.get('appliances').length;
		return attributes;
	},

	serviceRequestButton: function(){
		var id = this.id;
		return	'<a href="#render/service_request/show/'+id+'" class="btn btn-xs btn-green"  id="service_request-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa fa-ellipsis-h fa-fw"></i>' +
						'</a>';
	},
});