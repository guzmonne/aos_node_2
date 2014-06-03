App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	initialize: function(){
		this.awake.apply(this, arguments);
		Giraffe.Model.prototype.initialize.apply(this, arguments);
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