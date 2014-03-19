App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',

	defaults: function(){
		return {
			'model'          : null,
			'brand'          : null,
			'serial'         : null,
			'category'       : null,
			'subcategory'    : null,
			'accesories'     : [],
			'state'          : null,
			'client_name'    : null,
			'client_id'      : null,
			'repairmentType' : 'Garantía',
			'disperfect'     : null,
			'observations'   : null,
			'status'         : 'Abierto',
			'solution'       : null,
			'replacements'   : null,
			'inStock'        : true,
			'departuredAt'   : null,
			'repairedAt'     : null,
			'technician_name': null,
			'technician_id'  : null,
			'createdBy'      : 'Guzman Monne',
			'updatedBy'      : 'Guzman Monne',
		};
	},
});