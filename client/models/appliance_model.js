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
			'client_name'    : null,
			'client_id'      : null,
			'repairmentType' : 'Garantía',
			'defect'         : null,
			'observations'   : null,
			'status'         : 'Abierto',
			'cost'           : 0,
			'solution'       : null,
			'diagnose'       : null,
			'replacements'   : null,
			'inStock'        : null,
			'departuredAt'   : null,
			'repairedAt'     : null,
			'technician_name': null,
			'technician_id'  : null,
			'createdBy'      : 'Guzman Monne',
			'updatedBy'      : 'Guzman Monne',
		};
	},
});