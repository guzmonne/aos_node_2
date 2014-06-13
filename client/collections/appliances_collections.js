App.Collections.Appliances = App.Collections.BaseCollection.extend({
	url: '/api/appliances',
	model: App.Models.Appliance,

	awake: function(){
		App.extendMixin(this, App.Mixins.ServiceRequestAppliancesPDFReport);
	},
});