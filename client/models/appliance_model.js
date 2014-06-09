App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	awake: function(){
		this.listenTo(this, 'change:repairement_type', this.checkCost);
	},

	checkCost: function(){
		var repType = this.get('repairement_type');
		var cost    = this.get('cost');
		if (repType === 'Garantía'){
			if (App.defined(cost) && cost > 0){
				this.set('cost', 0);
			}
		}
	},

	defaults: function(){
		return {
			'status'            : 'Recibido',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},
});