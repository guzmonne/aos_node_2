App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	initialize: function(){
		this.awake.apply(this, arguments);
		Giraffe.Model.prototype.initialize.apply(this, arguments);
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
	dateDDMMYYYY: function(date){
		var parsedDate;
		if (date instanceof Date){
			parsedDate = date;
		} else {
			parsedDate = new Date(date);
		}
		return  parsedDate.getDate() +
			"/" + parsedDate.getMonth() + 
			"/" + parsedDate.getFullYear();
	},
});