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
			collection = colls[collection];
			options    = (options) ? options : {};
			context    = (context) ? context : this;
			fetch      = (options.fetch === false) ? false : true;
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
			subCollection.set(collection.set(objects, {remove: false}));
			if (options.filter){
				subCollection.listenTo(collection, 'add', function(model){
					var matches = _.matches(_.result(options, 'filter'));
					if(matches(model.attributes)){
						subCollection.add(model);
					}
				});
				subCollection.listenTo(collection, 'remove', function(model){
					var matches = _.matches(_.result(options, 'filter'));
					if(matches(model.attributes)){
						subCollection.remove(model);
					}
				});
				_.each(_.keys(_.result(options, 'filter')), function(key){
					var matches = _.matches(_.result(options, 'filter'));
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
			var success, fetch, conModels;
			collection    = colls[collection];
			conModels     = collection.where(condition);
			subCollection = new collection.constructor(conModels);
			options       = (options) ? options : {};
			context       = (context) ? context : this;
			fetch         = (options.fetch === false) ? false : true;
			options.data  = condition;
			if (options.success){ success = options.success; }
			options.success = function(){
				conModels = collection.where(condition);
				subCollection.set(conModels);
				if (success){ success.apply(context, arguments); }
			}; 
			if (fetch === true){ collection.fetch(options); }
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

		return {
			setSubCollection: setSubCollection,
			setModel        : setModel,
			getCollection   : getCollection,
			getModel        : getModel,
			getSubCollection: getSubCollection,
			add             : add,
			remove          : remove,
			get             : get,
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