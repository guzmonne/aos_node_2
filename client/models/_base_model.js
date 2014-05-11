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
		//this.listenTo(this, 'sync'                      , this.modelUpdated);
		//this.listenTo(app , this.name + ':model:updated', this.updateModel);
	},

	createChilds: function(){
		var self = this;
		if(	!_.isArray(this.childs) || !App.isObjectsArray(this.childs)){
			throw new Error("'childs' attribute must be an objects's array");
		}
		var childs = this.childs;
		var attrs = (arguments.length > 0) ? arguments[0] : {};
		_.each(childs, function(child){
			var attribute, type;
			if (!child.attribute || !child.type || !child.name){
				throw new Error("Every 'child' should have an 'attribute', 'name' and 'type' key value");
			}
			if (child.type === 'model'){
				type = "Models";
			} else if (child.type === 'collection'){
				type = "Collections";
			} else {
				throw new Error("'child' type must be 'model' or 'collection'");
			}
			self[child.attribute] = new App[type][child.name]();
			self[child.attribute].parent = self; 
			self.children.push(self[child.attribute]);
			if (attrs[child.attribute]){
				self[child.attribute].set(attrs[child.attribute]);
			}
			var triggerChange = function(){
				self.set(child.attribute, self[child.attribute].toJSON());
			};
			if(child.type === "model"){
				self.listenTo(self[child.attribute], 'change', triggerChange);
			} else if (child.type === "collection"){
				self.listenTo(self[child.attribute], 'add', triggerChange);
				self.listenTo(self[child.attribute], 'remove', triggerChange);
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

	// When the model gets synced with the server it calls the modelUpdated function.
	// This function will then trigger a custom event to let other models know that
	// it has been updated.
	modelUpdated: function(){
		app.trigger(this.name + ':model:updated', this);
	},

	// When the model hears that a model of its kind was updated it checks if it has
	// to incorporate this new data on itself. Once its done it will run another
	// cutom event to let the views know that some changes occured.
	updateModel: function(otherModel){
		if (otherModel.cid !== this.cid && otherModel.id === this.id){
			if (_.isFunction(this.customUpdate)){
				this.customUpdate(otherModel);
			} else {
				this.set(otherModel.attributes, {silent: true});
			}
			this.trigger('updated');
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