App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	initialize: function(){
		this.awake.apply(this, arguments);
		//Giraffe.Model.prototype.initialize.apply(this, arguments);
	},

	setRelatedField: function(collectionName, relatedFieldName, attributeName, name){
		var relatedField, result;
		if (!_.isString(collectionName))    {throw new Error('A collection name must be passes as a string');}
		if (!_.isString(relatedFieldName))  {throw new Error('A related field value must be passes as a string');}
		if (!_.isString(attributeName))     {throw new Error('An attribute name must be passes as a string');}
		relatedField = this.get(relatedFieldName);
		if(!relatedField){return;}
		name = (name) ? name : attributeName;
		try{
			result = app.storage.get(collectionName, relatedField).get(attributeName);
		} catch (err){
			return console.log(err.stack);
		}
		this.set(name, result);
		return result;
	},

	awake: function(){},

	push: function(attribute, value){
		var array = this.get(attribute);
		if (!_.isArray(array)){
			this.set(attribute, []);
		}
		array.push(value);
		this.set(attribute, array);
		this.trigger('change', this);
		this.trigger('change:' + attribute, this);
		return this;
	},

	pop: function(attribute, index){
		var array = this.get(attribute);
		if (!_.isArray(array)){return;}
		array.splice(index, 1);
		this.set(attribute, []).set(attribute, array);
		this.trigger('change', this);
		this.trigger('change:' + attribute, this);
		return this;
	},

	getAt: function(attribute, index){
		var array = this.get(attribute);
		if (!_.isArray(array)){return;}
		return array[index];
	},

	setDates: function(){
		var date, dates = ['createdAt', 'updatedAt', 'closedAt'];
		for (var i = 0; i < dates.length; i++){
			date = this.get(dates[i]);
			if (!_.isUndefined(date)){
				try {
					this.set(dates[i] + '_short', moment(date).format('DD/MM/YYYY'));
				} catch (err) {
					console.log(err.stack);
				}
			}
		}
	},

	cleanField: function(attributeName){
		if (!_.isString(attributeName)){throw new Error('The attributeName must be a string');}
		var attribute = this.get(attributeName);
		if (!attribute || attribute === ''){ 
			this.set(attributeName, null);
		}
	},

	// Just a basic function to parse a 'Date()' type.
	//dateDDMMYYYY: function(date){
	//	var parsedDate;
	//	if (date instanceof Date){
	//		parsedDate = date;
	//	} else {
	//		parsedDate = new Date(date);
	//	}
	//	return  parsedDate.getDate() +
	//		"/" + parsedDate.getMonth() + 
	//		"/" + parsedDate.getFullYear();
	//},

	downloadButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-info btn-margin"  name="'+this.name+'-download" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Download">' +
							'<i class="fa fa-download fa-fw"></i>' +
						'</a>';
	},

	printButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-info btn-margin"  name="'+this.name+'-print" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Imprimir">' +
							'<i class="fa fa-print fa-fw"></i>' +
						'</a>';
	},

	showButton: function(icon){
		var id = this.id;
		icon = (icon) ? icon : 'fa-ellipsis-h';
		return	'<a href="#render/'+this.name+'/show/'+id+'" class="btn btn-xs btn-green btn-margin"  id="'+this.name+'-details" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa '+icon+' fa-fw"></i>' +
						'</a>';
	},
});