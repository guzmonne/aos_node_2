App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "table-responsive",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	tableCollection: 'Appliances',
	modelView      : App.Views.ApplianceRowView,

	sameClient: true,

	appEvents: {
		'appliance:create:success': 'checkModel',
	},

	serialize: function(){
		var options = (App.defined(this.model)) ? (this.model.toJSON) : {};
		return options;
	},

	checkModel: function(model){
		if (App.defined(model)){
			var client_id = model.get('client_id');
			if (client_id && client_id === this.parent.model.id){
				this.collection.add(model);
			}
		}
	},

	checkIfsameClient: function(){
		var prev_client_id, model;
		var length = this.collection.length;
		if(length <= 1){
			this.sameClient = true;
			return true;
		}
		for(var i = 0; i < length; i++){
			model          = this.collection.at(i);
			prev_client_id = (prev_client_id) ? prev_client_id : model.get('client_id');
			if (prev_client_id !== model.get('client_id')){
				this.sameClient = false;
				break;
			}
		}
		return this.sameClient;
	},
});