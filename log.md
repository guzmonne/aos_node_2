AOS - LOG
=========
### Guzmán Monné
--------------------
#### **9/8/2014**
##### *Objectives:*
1. Add a nested collection/model library.
2. Change the 'appliances' code to return the model details on the 'model' key instead of on the 'model_id' key.
##### *Notes:*
- Yesterday on the 'add-to-collection' branch the methods ´addChild()´, and ´removeChild()´ so when ´dispose()´ is called the childs stored in the ´children´ array will be disposed.

	constructor: function(){
		if (_.isArray(this.childs)){this.setChilds();}
		Giraffe.Model.apply(this, arguments);
	},

	setChilds: function(){
		var self = this;
		self.children = [];
		_.each(this.childs, function(child){
			var attribute, type, container, containerType;
			if(!_.isObject(child)){
				return new Error('Child is not an object');
			}
			if(!child.attribute || !child.type || !child.container){
				return Error('Child is lacking either "attribute", "type", or "container" value');
			}
			attribute = child.attribute;
			type      = child.type;
			container = child.container;
			if (type === 'model'){
				containerType = "Models";
			} else if (type === 'collection') {
				containerType = "Collections";
			} else {
				return new Error('Child "type" must equal "model" or "collection".');
			}
			if (!App.defined(App[containerType][container])){
				return new Error('The "container" object does not exist');
			}
			self[attribute] = new App[containerType][container]();
			self.addChild(self[attribute]);
			self.listenTo(self[attribute], 'all', function(){
				var eventName = arguments[0];
				Array.prototype.shift.apply(arguments);
				self.trigger(attribute + ":" + eventName, arguments);
			});
		});
	},