App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	constructor: function(){
		this.listenTo(this, 'change:model_id', function(){
			this.model_id = app.storage.getModel("models", this.get('model_id'), {fetch: false});
		});
		Giraffe.Model.apply(this, arguments);
	},

	defaults: function(){
		return {
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},
});