App.Storage = (function(){
	var storage;

	var create = function(){
		var colls = {
			clients         : new App.Collections.Clients(),
			service_requests: new App.Collections.ServiceRequests(),
			appliances      : new App.Collections.Appliances(),
			models          : new App.Collections.Models(),
			users           : new App.Collections.Users(),
		};

		var collection = function(collection){
			return this.getCollection(collection, {fetch: false});
		};

		var getCollection = function(collection, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var fetch;
			collection     = colls[collection];
			options        = (options) ? options : {};
			context        = (context) ? context : this;
			fetch          = (options.fetch === false) ? false : true;
			options.remove = false;
			if (fetch === true){ collection.fetch(options); }
			return collection;
		};

		var setModel = function(collection, options, context){
			if (!collection)            { throw new Error('No "collection" was passed'); }
			if (!colls[collection])     { throw new Error('Collection "'+collection+'" is not defined'); }
			var model, id;
			collection = colls[collection];
			options    = (options) ? options : {};
			if (options.attributes && options.attributes._id){ id = options.attributes._id; }
			if (!id && options._id) { id = options._id; }
			if (id){ model = collection.get(id); }
			if (model === undefined){
				model = new collection.model({_id: id});
				collection.add(model);
			}
			if (options.attributes){ model.set(options.attributes); }
			return model;
		};

		var getModel = function(collection, id, options, context){
			if (!collection)            { throw new Error('No "collection" was passed'); }
			if (!colls[collection])     { throw new Error('Collection "'+collection+'" is not defined'); }
			if (!id && !_.isString(id)) { throw new Error('An "id must be passed"'); }
			var model, fetch;
			collection = colls[collection];
			options    = (options) ? options : {};
			context    = (context) ? context : this;
			fetch      = (options.fetch === false) ? false : true;
			model = collection.get(id);
			if (model === undefined){
				model = new collection.model({_id: id});
				collection.add(model);
			}
			if (options.attributes){ model.set(options.attributes); }
			if (fetch === true){ model.fetch(options); }
			return model;
		};

		var setSubCollection = function(collection, objects, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var subCollection;
			collection    = colls[collection];
			subCollection = new collection.constructor();
			options       = (options) ? options : {};
			context       = (context) ? context : this; 
			subCollection.set(collection.set(objects, {remove: false}));
			if (options.filter){
				var filter, matches;
				var getFilter = function(){
					if(_.isFunction(options.filter)){
						return options.filter.apply(context);
					} else {
						return options.filter;
					}
				};
				subCollection.listenTo(collection, 'add', function(model){
					filter  = getFilter();
					matches = _.matches(filter);
					if(matches(model.attributes)){
						subCollection.add(model);
					}
				});
				subCollection.listenTo(collection, 'remove', function(model){
					filter  = getFilter();
					matches = _.matches(filter);
					if(matches(model.attributes)){
						subCollection.remove(model);
					}
				});
				filter = getFilter();
				_.each(_.keys(filter), function(key){
					matches = _.matches(filter);
					subCollection.listenTo(collection, 'change:' + key, function(model){
						if(!matches(model.attributes) && subCollection.get(model)){
							subCollection.remove(model);
						} else if (matches(model.attributes) && !subCollection.get(model)){
							subCollection.add(model);
						}
					});
				});
			}
			return subCollection;
		};

		var getSubCollection = function(collection, condition, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			if (!condition && !_.isObject(condition)) { throw new Error('A "condition" must be passed'); }
			var success, fetch, conModels, matches;
			collection    = colls[collection];
			conModels     = collection.where(condition);
			subCollection = new collection.constructor(conModels);
			options       = (options) ? options : {};
			context       = (context) ? context : this;
			fetch         = (options.fetch === false) ? false : true;
			options.data  = condition;
			// add models fetched from the server to the subCollection
			if (options.success){ success = options.success; }
			options.remove  = false;
			options.success = function(){
				conModels = collection.where(condition);
				subCollection.set(conModels, {remove: false});
				if (success){ success.apply(context, arguments); }
			}; 
			if (fetch === true){ collection.fetch(options); }
			// set subCollection events
			matches = (options.matches) ? options.matches : _.matches(condition);
			subCollection.listenTo(collection, "add", function(model){
				if (matches(model.attributes) && !subCollection.get(model.id)){
					subCollection.add(model, {merge: true}); 
				}
			});
			subCollection.listenTo(subCollection, "change", function(model){
				if (!matches(model.attributes)){
					subCollection.remove(model);
				}
			});
			subCollection.listenTo(collection, "change", function(model){
				if (matches(model.attributes) && !subCollection.get(model.id)){
					subCollection.add(model); 
				}
			});
			subCollection.listenTo(collection, "remove", function(model){
				if(subCollection.get(model.id)){
					subCollection.remove(model);
				}
			});
			return subCollection;
		};

		var add = function(collection, model){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			return colls[collection].add(model, {merge: true});
		};

		var get = function(collection, id){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			return colls[collection].get(id);
		};

		var remove = function(collection, id){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			if (id instanceof Giraffe.Model){
				return colls[collection].remove(id);
			}
			return colls[collection].remove(colls[collection].get(id));
		};

		var newModel = function(collection){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var model;
			collection = colls[collection];
			model      = new collection.model();
			collection.listenTo(model, 'change:_id', function(){
				collection.add(model);
			});
			collection.listenTo(model, 'disposing', function(){
				collection.stopListening(model);
			});
			return model;
		};

		// Techs Collection Event Handlers
		var isTech = function(attributes){
			var permissions = attributes.permissions;
			if (permissions && permissions.roles && permissions.roles.isTech === true){
				return true;
			}
			return false;
		};
		colls.techs = getSubCollection("users", {techs: true}, {
			fetch  : false, 
			matches: isTech
		});

		return {
			setSubCollection: setSubCollection,
			setModel        : setModel,
			getCollection   : getCollection,
			getModel        : getModel,
			getSubCollection: getSubCollection,
			add             : add,
			remove          : remove,
			get             : get,
			newModel        : newModel,
			collection      : collection,
		};
	};

	return {
		getInstance: function(){
			if (!storage){ storage = create(); } 
			return storage;
		}
	};
})();