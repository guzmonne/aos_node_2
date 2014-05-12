App.Storage = (function(){
	var storage;

	var create = function(){
		var colls = {
			clients         : new App.Collections.Clients(),
			service_requests: new App.Collections.ServiceRequests(),
		};

		var setSubCollection = function(collection, objects, options, context){
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			collection    = colls[collection];
			subCollection = new collection.constructor();
			collection.set(objects);
			_.each(objects, function(obj){
				subCollection.add(collection.where(obj));
			});
			return subCollection;
		};

		var getCollection = function(collection, options, context){
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var fetch;
			collection = colls[collection];
			options    = (options) ? options : {};
			context    = (context) ? context : this;
			fetch      = (options.fetch === false) ? false : true;
			if (fetch === true){ collection.fetch(options); }
			return collection;
		};

		var getModel = function(collection, id, options, context){
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			if (!id && !_.isString(id)) { throw new Error('An "id must be passed"'); }
			var model, fetch;
			collection = colls[collection];
			options    = (options) ? options : {};
			context    = (context) ? context : this;
			fetch      = (options.fetch === false) ? false : true;
			options.id = id;
			model = collection.get(id);
			if (model === undefined){
				model = new collection.model({_id: id});
				collection.add(model);
			}
			if (fetch === true){ model.fetch(options); }
			return model;
		};

		var getSubCollection = function(collection, condition, options, context){
			if (!collection){ throw new Error('No "collection" was passed'); }
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
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			colls[collection].add(model);
		};

		var get = function(collection, id){
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			colls[collection].get(id);
		};

		var remove = function(collection, id){
			if (!collection){ throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			colls[collection].remove(colls[collection].get(id));
		};

		return {
			setSubCollection: setSubCollection,
			getCollection   : getCollection,
			getModel        : getModel,
			getSubCollection: getSubCollection,
			add             : add,
			remove          : remove,
			get             : get,
		};
	};

	return {
		getInstance: function(){
			if (!storage){ storage = create(); } 
			return storage;
		}
	};
})();