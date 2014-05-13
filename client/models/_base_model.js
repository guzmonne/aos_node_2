App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	constructor: function(){
		this.children = [];
		if (this.childs){this.createChilds.apply(this, arguments);}
		Giraffe.Model.apply(this, arguments);
	},

	awake: function(){},

	initialize: function(){
		this.awake.apply(this, arguments);
	},

	createChilds: function(){
		var self = this;
		if(	!_.isArray(this.childs) || !App.isObjectsArray(this.childs)){
			throw new Error("'childs' attribute must be an objects's array");
		}
		var childs = this.childs;
		var attrs = (arguments.length > 0) ? arguments[0] : {};
		_.each(childs, function(child){
			var attribute, type, storage;
			if (!child.attribute || !child.type){
				throw new Error("Every 'child' should have an 'attribute' and 'type' key value");
			}
			if (child.type === 'model'){
				type = "Models";
			} else if (child.type === 'collection'){
				type = "Collections";
			} else {
				throw new Error("'child' type must be 'model' or 'collection'");
			}
			if (child.name && child.filter){
				throw new Error("A 'child' can't have both a 'name' an a 'filter' options");
			} else if (child.name && !child.filter) {
				self[child.attribute] = new App[type][child.name]();
				if (attrs[child.attribute]){
					self[child.attribute].set(attrs[child.attribute]);
				}
			} else if  (!child.name && child.filter) {
					var collection, options, objects;
					if (child.type === "model"){
						collection = (child.collection) ? child.collection : child.attribute + 's';
						options    = {};
						if (attrs[child.attribute]) { options.attributes = attrs[child.attribute]; }
						self[child.attribute] = app.storage.setModel(collection, options);
					} else {
						collection            = (child.collection) ? child.collection : child.attribute;
						options               = {};
						objects               = (attrs[child.attribute]) ? attrs[child.attribute] : {};
						options.filter        = child.filter;
						self[child.attribute] = app.storage.setSubCollection(collection, objects, options);
					}
			} else {
				throw new Error('A "child" must have either a "name" or a "filter" value');
			}
			self[child.attribute].parent = self; 
			self.children.push(self[child.attribute]);
			var triggerChange = function(){
				self.set(child.attribute, self[child.attribute].toJSON());
			};
			if(child.type === "model"){
				self.listenTo(self[child.attribute], 'change', triggerChange);
			} else if (child.type === "collection"){
				self.listenTo(self[child.attribute], 'add', triggerChange);
				self.listenTo(self[child.attribute], 'remove', triggerChange);
				self.listenTo(self[child.attribute], 'change', triggerChange);
			}
			self[child.attribute].listenTo(self, 'disposing', self[child.attribute].dispose);
		});
	},

	parse: function(response){
		var self = this;
		if (this.childs){
			var attributes = _.map(this.childs, function(child){
				return child.attribute;
			});
			_.each(attributes, function(attribute){
				if (response[attribute]){
					self[attribute].set(response[attribute]);
				}
			});
		}
		return response;
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