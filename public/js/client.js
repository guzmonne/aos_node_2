// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

// Delete calling dispose on model when it is removed from a collection.
delete Giraffe.Collection.prototype._removeReference;

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Mixins     : {},

	vent: _.extend({}, Backbone.Events),

	defined: function(object){
		if (typeof object !== "undefined" && object !== null) {
			return true;
		} else {
			return false;
		}
	},

	animate: function(el, animation, callback, context){
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback.apply(context);}
		}, 800);
	},

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	scrollTo: function(position){
		var pos;
		var $viewport = $('html, body');
		if (_.isNumber(position)){
			pos = position;
		} else {
			pos = this.elPosition(position);
		}
		$viewport.animate({
			scrollTop: pos
		}, 500);
		$viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
			if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
				// This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
				$viewport.stop().unbind('scroll mousedown DOMMouseScroll mousewheel keyup'); 
			}
		});	
	},

	elPosition: function(el){
		return $(el).offset().top;
	},

	sseInit: function(){
		if (!!window.EventSource){
			this.vent.source = new EventSource();
			this.vent.source.addEventListener('sse::connection', function(e){
				console.log(e);
			});
			this.vent.onmessage = function(event){
				data = JSON.parse(event.data);
				event = data.event;
				delete data.event;
				this.vent.trigger(event, data);
			};
			this.vent.onerror = function(event){
				if (event.target.readyState === EventSource.CLOSED){
					console.log("Connection failed. Will not retry.");
				}
			};
		} else {
			console.log("EventSource is not supported");
		}
	},

	isObjectsArray: function(value){
		return _.reduce(value, function(memo, ele){ 
			if(memo === false || !_.isObject(ele)){
				return false;
			} else {
				return true; 
			}
		}, true);
	},
};
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
// !!!
// Type: Mixin
// -----
// Description:
// ------------
// This mixin has the necessary functions to be able to select the model from a modal
// view. Is important to add the necessary events that will trigger this functions.
// ------------ 
// !!!
App.Mixins.SelectModel = {
	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This method calls the modal controller to display an index view of the models.
	// ------------ 
	// !!!
	selectModel: function(e){
		if(e){e.preventDefault();}
		if(!this.modelSelectModalView){
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
		}
		app.modalController.displayModal(this.modelSelectModalView, this, 'modelSelected');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be triggered by an appEvent. When called the model is picked up
	// and added to the current view model.
	// ------------ 
	// !!!
	modelSelected: function(model){
		if(!this.model.prevModelId){ this.model.prevModelId = this.model.get('model_id'); }
		this.model.set('model_id', model.id);
	},

	// !!!
	// Type: Object
	// -----
	// Description:
	// ------------
	// Serializes the model and passes the information of the model to the template for easy
	// rendering.
	// ------------ 
	// !!!
	serialize: function(){
		var object = this.model.toJSON();
		var model  = this.model.model_id;
		if (model){
			_.extend(object, model.pick('brand', 'category', 'subcategory', 'model'));
		}
		return object;
	},

	setModelDetails: function(){
		this.$('[name=brand]').val(this.model.model_id.get('brand'));
		this.$('[name=model]').val(this.model.model_id.get('model'));
		this.$('[name=category]').val(this.model.model_id.get('category'));
		this.$('[name=subcategory]').val(this.model.model_id.get('subcategory'));
	},

	setAccessories: function(){
		var self = this;
		var accessories = this.model.get('accessories');
		_.each(accessories, function(accessory){
			self.$('[name=accessories]').tagsinput("add", accessory);
		});
	},
};
// !!!
// Type: Mixin
// -----
// Description:
// ------------
// Mixin that adds the necessary functions to announce the entrance or exit of a show view.
// The show views extend this mixin to let the row views if they are called or are disposed.
// ------------ 
// !!!
App.Mixins.ShowViewAnnouncer = {
	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowActive: function(){
		this.model.trigger('model:show:active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowInactive: function(){
		this.model.trigger('model:show:inactive');
	},
};
App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	constructor: function(attributes, options){
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
						self[child.attribute] = app.storage.setSubCollection(collection, objects, options, self);
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
		if (this.childs){
			var self = this;
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
App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	constructor: function(){
		this.listenTo(this, 'change:model_id', function(){
			this.model_id = app.storage.getModel("models", this.get('model_id'), {fetch: false});
		});
		this.listenTo(this, 'change:technician_id', function(){
			this.technician = app.storage.getModel("techs", this.get('technician_id'), {fetch: false});
		});
		Giraffe.Model.apply(this, arguments);
	},

	defaults: function(){
		return {
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},
});
App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',
	name   : 'client',

	defaults: function(){
		return {
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},

	childs: [
		{
			attribute: 'phones',
			type: 'collection',
			name: 'Phones'
		},
		{
			attribute: 'addresses',
			type: 'collection',
			name: 'Addresses',
		}
	],
});

App.Models.Phone = App.Models.BaseModel.extend({
	name: 'phone',
	defaults: function(){
		return {
			number: '',
		};
	},
});

App.Models.Address = App.Models.BaseModel.extend({
	name: 'address',
	defaults: function(){
		return {
			street    : '',
			city      : '',
			department: '',
		};
	},
});
App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + this.id;
		}
		return u;
	},

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});
App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	defaults: function(){
		return {
			'status'        : 'Pendiente',
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
		};
	},

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliancesCount = this.get('appliances').length;
		return attributes;
	},
});
App.Models.User = App.Models.BaseModel.extend({
	urlRoot: '/api/users',

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné',
		};
	},
});
App.Collections.BaseCollection = Giraffe.Collection.extend({
	modelName  : '',
	modelFilter: {},

	url: function(){
		return '/api/' + this.modelName;
	},

	awake: function(){},

	initialize: function(options){
		this.awake.apply(this, arguments);
	},
});
App.Collections.Appliances = Giraffe.Collection.extend({
	url: '/api/appliances',
	model: App.Models.Appliance,
});
App.Collections.Clients = Giraffe.Collection.extend({
	url  : '/api/clients',
	model: App.Models.Client,
});

App.Collections.Phones = Giraffe.Collection.extend({
	model: App.Models.Phone,
});

App.Collections.Addresses = Giraffe.Collection.extend({
	model: App.Models.Address,
});
App.Collections.Models = Giraffe.Collection.extend({
	url  : '/api/models',
	model: App.Models.Model,
});
App.Collections.ServiceRequests = Giraffe.Collection.extend({
	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// If the collection has a client_id parameter then we call for only the service_requests
	// assigned to that client
	// ------------ 
	// !!!
	url  : function(){
		var u = '/api/service_requests';
		if (this.client_id){
			u = u + '/client/' + this.client_id;
		}
		return u;
	},

	model: App.Models.ServiceRequest,
});
App.Collections.Users = Giraffe.Collection.extend({
	url  : '/api/users',
	model: App.Models.User,
});
App.Views.BaseView = Giraffe.View.extend({
	awake: function(){},
	
	// !!!
	// Type: Boolean
	// -------------
	// Description:
	// ------------
	// When the 'sync' button is pressed this function gets called to see if the 
	// current portlet-child view has the 'onSync()' method needed to sync the 
	// data.
	// ------------
	// !!!
	canSync: function(){
		if (App.defined(this.onSync)){
			this.onSync();
			return true;
		} else {
			return false;
		}
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be called after the onSync() method ends to stop the portlet spinner
	// ------------
	// !!!
	afterSync: function(){
		this.invoke("stopSpin");
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Checks if the 'value' is bigger than 1 and then sets the target text to plural or singular
	// ------------ 
	// Arguments:
	// ----------
	// value [Number]      : Value to check if its bigger than one
	// target [DOM element]: Dom element to set the resulting text
	// singular [String]   : Singular value to set the 'target' text
	// plural [String]     : Plural value to set the 'target' text  
	// ----------
	// !!!
	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 1){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called when clicket the portlet close button. It disposes the Portlet view 
	// and adds a simple animation.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: click event
	// ----------
	// !!!
	closeView: function(e){
		if(App.defined(e)){
			e.preventDefault();
		}
		var self = this;
		//this.dispose();
		this.$el.addClass('closing');
		setTimeout(function(){
			self.dispose();
		}, 500);
		//App.animate(this.$el, 'slideOutUp', function(){
		//	self.dispose();
		//});
	},

	// !!!
	// Type: JSON
	// -----
	// Description:
	// ------------
	// Basic serialize functions for the views. It just calls the 'toJSON()' method if 
	// the view has a model
	// ------------ 
	// !!!
	serialize: function(){
		if (App.defined(this.model)){
			return this.model.toJSON();
		}
	},

	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// Returns a string with the first character capitalizes
	// ------------ 
	// Arguments:
	// ----------
	// string [String]: String to be capitalized
	// ----------
	// !!!
	capitaliseFirstLetter: function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// Takes a string that can be a word or a collection of words separated by
	// underscores and returns a sting with every word capitalized and no spaces
	// ------------ 
	// Arguments:
	// ----------
	// doc [String]: String to be titelized. Can only be a word or a group of words
	// separated by an underscore.
	// ----------
	// !!!	
	titelize: function(doc){
		var docName = '';
		if (doc.indexOf('_') === -1){
			docName = this.capitaliseFirstLetter(doc);
		} else {
			var nameArray = doc.split('_');
			for(var i = 0; i < nameArray.length; i++){
				docName = docName + this.capitaliseFirstLetter(nameArray[i]); 
			}
		}
		return docName;
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Trigers an event that is captured by the portlet view which will then display a 
	// message based on the options passed
	// ------------ 
	// Arguments:
	// ----------
	// options [Object]: object with the necessary parameters to display a message on a Portlet
	// View.
	// ----------
	// !!!
	displayPortletMessage: function(options){
		var defaultOptions = {
			viewCid: this.parent.cid,
			title  : 'Titulo:',
			message: 'Cuerpo del mensaje',
		};
		var opts = typeof options !== 'undefined' ? options : defaultOptions; 
		app.trigger('portlet:message', opts);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Blocks almost all inputs on a form
	// ------------ 
	// !!!
	blockForm: function(){
		this.$('input').attr('readonly', true);
		this.$('textarea').attr('readonly', true);
		this.$('select').attr('disabled', true);
		this.$('span[data-role=remove]').attr('data-role', 'not-remove');
		this.$('input[type=checkbox]').attr('disabled', true);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Unblocks almost all inputs on a form
	// ------------ 
	// !!!
	unblockForm: function(){
		this.$('input').attr('readonly', false);
		this.$('textarea').attr('readonly', false);
		this.$('select').attr('disabled', false);
		this.$('span[data-role=not-remove]').attr('data-role', 'remove');
		this.$('input[type=checkbox]').attr('disabled', false);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Activates the tagsinput plugin depending on the passed event.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: Ussualy a click event.
	// ----------
	// !!!
	activateTags: function(e){
		if (!e){return;}
		this.$(e.currentTarget).closest('.bootstrap-tagsinput').addClass('active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Deactivates the tagsinput plugin on an element passed on the event.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: Ussualy a click event.
	// ----------
	// !!!
	deactivateTags: function(e){
		if (!e){return;}
		var input = this.$(e.target);
		var value = input.val();
		if (value !== ''){
			this.$(e.target.offsetParent).find('select').tagsinput('add', value);
			input.val('');
		}
		this.$('.bootstrap-tagsinput').removeClass('active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	//announce: function(){
	//	if(!App.defined(this.model)){return;}
	//	app.trigger(this.modelName + ':show:active', this.model.id);
	//},

	updateViewField: function(fieldName, value){
		value = (value) ? value : this.model.get(fieldName); 
		var field = this.$('[name='+ fieldName +']:input');
		if (!field){ return; }
		if (field.attr('type') === "checkbox"){
			return field.prop("checked", value);
		}
		if (field.is('input') || field.is('select') || field.is('textarea')){ 
			return field.val(value);
		}
	},

	updateViewText: function(field){
		this.$('[name='+ field +']').text(this.model.get(field));
	},

	invoke: function() {
    var args, methodName, view;
		methodName = arguments[0]; 
		args       = (2 <= arguments.length) ? Array.prototype.slice.call(arguments, 1) : [];
		view       = this;
    while (view && !view[methodName]) {
      view = view.parent;
    }
    if (view !== null ? view[methodName] : void 0) {
      return view[methodName].apply(view, args);
    } else {
      //error('No such method name in view hierarchy', methodName, args, this);
      return false;
    }
  }
});
App.Views.CarouselView = App.Views.BaseView.extend({
	template: HBS.carousel_template,

	className: "row",

	ui: {
		$range      : "#range-selector",
		$rangeOutput: "output",
		$next       : "#next-model",
		$prev       : "#prev-model",
	},

	events: {
		'change $range': 'moveCarousel',
		'click $next'  : 'updateRange',
		'click $prev'  : 'updateRange',
	},

	initialize: function(){
		if (this.air){
			this.$el.addClass("air-t");
		}
	},

	afterRender: function(){
		var view;
		var carouselItemView = App.Views[this.carouselItemView];
		var options = (this.carouselItemViewOptions) ? this.carouselItemViewOptions : {}; 
		if(!App.defined(carouselItemView)){return;}
		if (!this.collection){return;}
		for(var i = 0; i < this.collection.length; i++){
			options.model     = this.collection.at(i);
			options.className = (i === 0) ? "item active" : "item";
			view              = new carouselItemView(options);
			view.attachTo(this.$('#carousel-items-' + this.cid));
		}
		this.$range.attr("max", this.collection.length);
		this.$('#carousel-' + this.cid).carousel({
      interval: 0,
      pause: "hover"
    });
	},

	serialize: function(){
		var options               = {};
		options.cid               = this.cid;
		options.carouselClassName = (this.carouselClassName) ? this.carouselClassName : null;
		options.carouselTitle     = (this.carouselTitle)     ? this.carouselTitle     : null;
		return options;
	},

	moveCarousel: function(){
		var rangeVal = parseInt(this.$range.val());
		var slide = rangeVal - 1;
		this.$rangeOutput.val(rangeVal);
		this.$('#carousel-' + this.cid).carousel(slide);
	},

	updateRange: function(e){
		var id = e.currentTarget.id;
		var rangeVal = parseInt(this.$range.val());
		if (id === "next-model"){
			rangeVal = rangeVal + 1;
			if (rangeVal > this.collection.length){
				rangeVal = 1;
			}
		} else if (id === "prev-model"){
			rangeVal = rangeVal - 1;
			if (rangeVal <= 0){
				rangeVal = this.collection.length;
			}
		}
		this.$range.val(rangeVal);
		this.$rangeOutput.val(rangeVal);
	},
});
App.Views.FormView = App.Views.BaseView.extend({
	edit  : false,
	editOn: false,
	focus : '',

	createSuccessMessage: {
		title  : 'Exito',
		message: 'Se han guardado los datos con exito',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},
	
	updateSuccessMessage: {
		title  : 'Exito',
		message: 'Se han actualizado los cambios con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	constructor: function(){
		if (this.formEvents){
			_.extend(this.events, this.formEvents);
		}
		App.Views.BaseView.apply(this, arguments);
	},

	initialize: function(){
		this.awake.apply(this, arguments);
		this.bindEvents.apply(this, arguments);
		_.once(this.editForm);
		_.once(this.newForm);
	},

	bindEvents: function(){},
	awake: function(){},

	events: {
		'submit form'             : 'submitForm',
		'click button#reset-model': 'reRender',
		'click button#edit-model' : 'editModel',
		'click .checkbox label'   : 'toggleCheckBox',
	},

	reRender: function(e){
		if (e){e.preventDefault();}
		this.editOn = false;
		this.render();
	},

	afterRender: function(){
		if (this.edit){
			this.editForm();
		} else {
			this.newForm();
		}
	},

	newForm: function(){
		this.$('#edit-model').remove();
	},

	editForm: function(){
		this.$('#save-model').remove();
		this.blockForm();
	},

	editModel: function(e){
		if (e){e.preventDefault();}
		this.editOn = (this.editOn) ? false : true;
		if (this.editOn){
			this.unblockForm();
			this.$(this.focus).focus();
		} else {
			this.blockForm();
		}
		this.$('.btn').toggleClass('hide');
	},

	submitForm: function(e){
		if (e){e.preventDefault();}
		if (this.edit){
			this.updateModel();
		} else {
			this.createModel();
		}
	},

	createModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.createSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.createErrorMessage);
			}
		});
		this.model = app.storage.newModel(self.storage);
		this.bindEvents();
		this.cleanForm();
	},

	updateModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.updateSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.updateErrorMessage);
			}
		});
		this.editModel();
	},

	saveModel: function(){
		this.model.set(this.$('form').formParams());
	},

	cleanForm: function(){
		this.$('input').val('');
		this.$('textare').text('');
		this.$('input[type=checkbox]').val(false);
		this.$('input[type=radio]').val(false);
		this.$(this.focus).focus();
	},

	toggleCheckBox: function(e){
		var name     = e.target.htmlFor;
		var checkbox = this.$('[name='+name+']');
		if (checkbox.attr("disabled")){return;}
		checkbox.prop("checked", !checkbox.prop('checked'));
	},
});
App.Views.ModalView = App.Views.BaseView.extend({
	template: HBS.modal_base_layout_template,
	
	modalOptions: {
		header      : true,
		footer      : true,
		customFooter: false,
		title       : '',
		modalClass  : false,
	},

	initialize: function(){
		if (!this.bodyView){return;}
		if (this.bodyView.modalOptions){_.extend(this.modalOptions, this.bodyView.modalOptions);}
	},

	attributes: function(){
		return {
			'class'          : "modal fade",
			'tabindex'       : "-1",
			'role'           : "dialog",
			'aria-labelledby': this.name,
			'aria-hidden'    : true,
			'id'             : 'modalContainer',
		};
	},

	afterRender: function(){
		this.bodyView.attachTo('.modal-body', {method: 'html'});
	},
	
	serialize: function(){
		return this.modalOptions;
	}
});
App.Views.NewView = App.Views.BaseView.extend({
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		if(!App.defined(this.formViewName)){return new Error('formViewName not defined');}
		this.formView = new App.Views[this.formViewName]({
			model: this.model,
		});
		this.formView.attachTo(this.$el, {method: 'html'});
		this.model = undefined;
	},
});
App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.listenTo(this.model, 'change' , this.render);
		this.listenTo(this.model, 'remove', this.invokeRemoveRow);
		this.listenTo(app, 'model:show:active',   this.activate);
		this.listenTo(app, 'model:show:inactive', this.deactivate);
	},

	afterRender: function(){
		if (this.active){this.activate();}
		app.trigger('row:rendered', this.model.id);
		this.$el.tooltip();
		if(this.parent.selection){
			this.$('a#show').remove();
			this.$('a#selected').removeClass('hide');
		}
		if(_.isFunction(this.onceRendered)){this.onceRendered();}
	},

	selected: function(){
		if(!App.defined(this.model)){return;}
		app.modalController.runCallerMethod(this.model);
	},

	serialize: function(){
		if(!App.defined(this.model)){return;}
		if (_.isFunction(this.model.serialize)){
			return this.model.serialize();
		} else {
			return this.model.toJSON();
		}
	},

	activate: function(id){
		if(this.model && this.model.id !== id){return;}
		this.activated = true;
		this.$el.addClass('selected');
	},

	deactivate: function(id){
		if(this.model && this.model.id !== id){return;}
		if(this.$el.hasClass('selected')){
			this.activated = false;
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});
App.Views.ShowView = App.Views.BaseView.extend({
	sync  : true,

	initialize: function(){
		this.awake.apply(this, arguments);
		this.listenTo(app, 'row:rendered', this.checkEventCaller);
		this.listenTo(this, 'disposing', this.modelShowInactive);
		this.modelShowActive();
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowActive: function(){
		if(!this.model){return;}
		app.trigger('model:show:active', this.model.id);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowInactive: function(){
		if(!this.model){return;}
		app.trigger('model:show:inactive', this.model.id);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Checks if the event emitter has the same model as we do
	// ------------ 
	// Arguments:
	// ----------
	// id [String]: id of the model handled by the event emmiter. If it is the same
	// as ours then we emit the show active event.
	// ----------
	// !!!
	checkEventCaller: function(id){
		if (id === this.model.id){
			this.modelShowActive();
		}
	},
});
App.Views.TabView = App.Views.BaseView.extend({
	template: HBS.tabs_template,

	tabs              : {},
	tabDetails        : {},
	activeView        : null,

	events: {},

	bindEvents: function(){},

	initialize: function(){
		this.awake.apply(this, arguments);
		if(!this.modelName){return new Error('View must have a modelName defined');}
		this.timestamp = _.uniqueId();
		this.createTabs();
		this.bindEvents.apply(this);
		this.listenTo(this.model, 'sync', this.setHeader);
	},
	
	createTabs: function(){
		var self   = this;
		var object = {
			modelName: this.modelName,
			tab      : [],
		};
		var tabs = _.result(self, 'tabs');
		_.forEach(tabs, function(tab, index){
			var tabFunction;
			var tabDetails = {
				href : self.modelName + "-" + tab.id + "-" + self.timestamp,
				id   : self.modelName + "-" + tab.id,
				title: tab.title,
			};
			if (tab.class){
				tabDetails.class = tab.class; 
			}
			if (_.isFunction(tab.renderFunction)){
				tabFunction = tab.renderFunction;
			} else {
				tabFunction = function(){	
					self.renderTabView(tab.id, tab.view);
				};
			}
			if(tab.active){
				tabDetails.active = true;
				self.activeView   = tabFunction;
			} else {
				self["renderTab" + index] = tabFunction;
				self.events['click #' + self.modelName + "-" + tab.id] = "renderTab" + index;
			}
			object.tab.push(tabDetails);
		});
		this.tabDetails = object;
	},

	renderTabView: function(id, viewName){
		if (!App.defined(this[id])){
			this[id] = new App.Views[viewName]({model: this.model});
			this[id].attachTo(this.$('#' + this.modelName + '-' + id + '-' + this.timestamp), {method: 'html'});
		}
	},

	afterRender: function(){
		if (_.isFunction(this.activeView)){this.activeView();}
		this.invoke('setHeader');
	},

	serialize: function(){
		return this.tabDetails;
	},
});

//{{#each tab}}
//<li {{#if active}}class="active"{{/if}}>
//	<a href="#{{href}}" data-toggle="tab" id="{{id}}">
//		{{title}}
//	</a>
//</li>
//{{/each}}

//{{#each tab}}
//  <div class="tab-pane fade in {{#if active}}active{{/if}} {{#if class}}{{class}}{{/if}}" id="{{href}}"></div>
//{{/each}}
App.Views.TableView = App.Views.BaseView.extend({
	rowViewOptions: {},
	fetchOptions	: {},

	constructor: function(options){
		this.rendered = false;
		this.synced   = (options.synced) ? options.synced : false;
		Giraffe.View.apply(this, arguments);
	},

	initialize: function(){
		var self = this;
		this.awake.apply(this, arguments);
		this.listenTo(this.collection, 'sync', this.tableFetched);
		_.bind(this.append, this);
		_.once(this.activateTable);
		this.timestamp = _.uniqueId();
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	afterRender: function(){
		var self = this;
		if(!App.defined(this.tableEl)){
			throw new Error('Attribute tableEl must be set.');
		}
		if(this.synced === true && this.rendered === false){ this.appendCollection(); }
		this.rendered = true;
	},

	appendCollection: function(collection){
		var self   = this;
		this.$('tbody').remove();
		this.tbody = $('<tbody />');
		_.each(this.collection.models, function(model){
			self.rowViewOptions.model = model;
			var view = new self.modelView(self.rowViewOptions);
			self.addChild(view);
			self.tbody.append(view.render().el);
		});
		this.$('table').append(this.tbody);
		this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
		this.$('table').wrap('<div class="table-wrap table-responsive-width"></div>');
		this.stopListening(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'add', this.append);
	},

	tableFetched: function(){
		this.afterSync();
		if(this.rendered === true && this.synced === false){ this.appendCollection(); }
		this.synced = true;
	},	

	append: function(model){
		if (!App.defined(this.modelView)){throw new Error('Option modelView not defined');}
		this.rowViewOptions.model = model;
		var view = new this.modelView(this.rowViewOptions);
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},

	onSync: function(){
		this.collection.fetch(this.fetchOptions);
	},
});
App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	viewTree: {
		"client" : {
			storage: "clients",
			model  : "Client",
		},
		"service_request": {
			storage: "service_requests",
			model  : "ServiceRequest"
		},
		"appliance": {
			storage: "appliances",
			model  : "Appliance",
		},
		"model": {
			storage: "models",
			model  : "Model",
		}, 
		"user": {
			storage: "users",
			model  : "User",
		},
		"tech": {
			storage: "techs",
			model  : "Tech"
		}
	},

	showView: function(doc, id){
		var treeInfo = this.viewTree[doc];
		if (!treeInfo) { throw new Error('Invalid doc: "'+ doc +'" on showView'); }
		if (!id)       { throw new Error('No "id" was passed'); }
		var params = _.extend({
			viewName         : treeInfo.model + 'ShowView',
			viewType         : "show",
			portletFrameClass: "green",
			options: {
				_id: id
			}
		}, treeInfo);
		this.showOrGoTo(params, this.showComparator);
	},

	docView: function(doc, type){
		var treeInfo = this.viewTree[doc];
		if (!treeInfo) { throw new Error('Invalid doc: "'+ doc +'" on showView'); }
		if (!type)     { throw new Error('No "type" was passed'); }
		var params = _.extend({
			viewName : treeInfo.model + this.titelize(type) + 'View',
			viewType : type,
		}, treeInfo);
		if (type === "index"){
			params.collection = true;
		}
		this.showOrGoTo(params);
	},

	defaultComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&& 
			App.defined(view.viewName)							&& 
			view.viewName === this.viewName
		);
	},

	showComparator: function(portletView){
		return (
			portletView instanceof(App.Views.PortletView)	&&
			App.defined(portletView.view)									&&
			App.defined(portletView.view.model)						&&
			App.defined(portletView.viewName)							&& 
			portletView.viewName === this.viewName				&&
			portletView.view.model.id === this.options._id
		);
	},

	showOrGoTo: function(params, comparator){
		if (!params)                     { throw new Error('"params" must be defined'); }
		if (!params.viewName)            { throw new Error('"params.viewName" must be defined'); }
		if (!App.Views[params.viewName]) { throw new Error('View "App.Views.'+params.viewName+'" is not defined'); } 
		var renderedView;
		Backbone.history.navigate((Backbone.history.fragment).replace('render/', ''));
		comparator   = (comparator) ? comparator : this.defaultComparator;
		renderedView = this.viewIsRendered(comparator, params);
		if (renderedView){
			App.scrollTo(renderedView.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		if(!params || !_.isObject(params)){ throw new Error('"params" must be defined'); }
		var model, collection, fetchOptions, portletView;
		switch (params.viewType){
		case "show":
			if (params.model instanceof Giraffe.Model){ 
				model = params.model; 
			} else {
				model = app.storage.getModel(params.storage, params.options._id, {fetch: false});
			} 
			params.view  = new App.Views[params.viewName]({model: model});
			if (params.fetch === undefined || params.fetch === true){
				fetchOptions = (params.view.fetchOptions) ? params.view.fetchOptions : {};
				model.fetch(fetchOptions);
			}
			break;
		case "new":
			if (params.model instanceof Giraffe.Model){
				model = params.model;
			} else {
				model = app.storage.newModel(params.storage);
			}
			params.view = new App.Views[params.viewName]({model: model});
			break;
		case "index":
			collection   = app.storage.collection(params.storage);
			params.view  = new App.Views[params.viewName]({collection: collection});
			if (params.fetch === undefined || params.fetch === true){
				fetchOptions = (params.view.fetchOptions) ? params.view.fetchOptions : {};
				collection.fetch(fetchOptions);
			}
			break;
		}
		portletView = new App.Views.PortletView(_.pick(params, "view", "viewName", "portletFrameClass", "flash"));
		this.appendToContent(portletView);
		App.scrollTo(portletView.el);
	},

	viewIsRendered: function(comparator, context){
		var self = (context) ? context : this;
		var result = null;
		for(var i = 0; i < app.children.length; i++){
			if ( comparator.apply(self, [ app.children[i] ]) ){
				result = app.children[i];
				break;
			}
		}
		return result;
	},

	appendToContent: function(view){
		app.attach(view, {el: '#content-el', method: 'prepend'});
	},
});
App.Views.ApplianceRowView = App.Views.RowView.extend({
	template: HBS.appliance_row_template,
	modelName: 'appliance',

	beforeRender: function(){
		if (!this.model.get('model') && this.parent.baseModel){
			this.model.model = this.parent.baseModel;
		}
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object        = this.model.toJSON();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			var closedAt  = this.model.get('closedAt');
			if (this.model.model_id)  { _.extend(object, this.model.model_id.pick('brand', 'category', 'subcategory', 'model')); }
			if (this.model.technician){ object.technician_name = this.model.technician.get('name'); }
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});
App.Views.ApplianceCarouselView = App.Views.CarouselView.extend({
	air              : true,
	carouselItemView : "ApplianceEditFormView",
	carouselClassName: "col-lg-offset-2 col-lg-8 col-md-12",
	carouselTitle    : "Equipos",
});
App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template,

	editMode: false, 

	events: {
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "reRender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'changeRepairementType',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:status'          , function(){this.updateViewField.apply(this, ['status']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewField.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:repairement_type', function(){
			this.updateViewField.apply(this, ['repairement_type']);
			this.changeRepairementType();	
		});
		this.listenTo(this.model, 'change:technician_id'   , this.fillTechnicianField);
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(app.storage.collection("techs"), 'add'   , this.fillTechnicianField);
		this.listenTo(app.storage.collection("techs"), 'remove', this.fillTechnicianField);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		this.fillTechnicianField();
		if(!this.editMode){
			this.blockForm();
			this.toggleButtons();
		}
		this.changeRepairementType();
	},

	toggleButtons: function(){
		this.$('button').toggleClass('hide');
	},

	fillTechnicianField: function(){
		var technicians = _.map(app.storage.collection("techs").models, function(model){
			return {id: model.id, name: model.get("name")};
		});
		var field = self.$('[name=technician_id]');
		field.empty();
		_.each(technicians, function(technician){
			if (!technician.id || !technician.name){return;}
			field.append(
				'<option value="'+technician.id+'">'+technician.name+'</option>'
			);
		});
		field.prepend(
				'<option value="" selected></option>'
		);
		this.changeTechnician();
	},

	changeRepairementType: function(){
		var repairementTypeVal = this.$('[name=repairement_type]').val();
		if (repairementTypeVal === "Presupuesto"){
			this.$('#cost-form-group').show();
		} else {
			this.$('#cost-form-group').hide();
		}
	},

	changeTechnician: function(){
		var id = this.model.get('technician_id');
		console.log(id);
		if (!id || id === '' || id === '1') {
			this.$('[name=technician_link]').attr('disabled', true);
		} else {
			this.$('[name=technician_id]').val(id);
			this.$('[name=technician_link]').attr('href', '#render/user/show/' + id);
			this.$('[name=technician_link]').attr('disabled', false);
		}
	},

	editAppliance: function(e){
		e.preventDefault();
		this.unblockForm();
		this.toggleButtons();
		this.editMode = true;
	},

	saveAppliance: function(e){
		var self    = this;
		e.preventDefault();
		this.saveModel();
		this.model.save(null, {
			success: function(){
				self.invoke('showMessage', {
					title  : 'Equipo Actualizado',
					message: 'El equipo se ha actualizado con exito',
					class  : 'success',
				});
				self.model.prevModelId = self.model.get('model_id');
			}
		});
		this.editMode = false;
		this.blockForm();
		this.toggleButtons();
	},

	reRender: function(e){
		e.preventDefault();
		this.editMode = false;
		var model_id  = this.model.changedAttributes().model_id;
		if (this.model.prevModelId){ this.model.set('model_id', this.model.prevModelId); }
		this.render();
	},

	saveModel: function(){
		this.setRepType();
		this.model.set(_.pick(this.$('form').formParams(), 
			'serial',
			'observations',
			'repairement_type', 
			'defect',
			'accessories',
			'status',
			'replacements',
			'diagnose',
			'solution',
			'technician_id'
		));
	},

	setRepType: function(){
		var oldRepType = this.model.get('repairement_type');
		var newRepType = this.$('[name=repairement_type]').val();
		if((oldRepType !== newRepType) && (newRepType === "Garantía")){
			this.model.set('cost', 0);
		} else {
			this.model.set('cost', this.$('[name=cost]').val());
		}
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});
App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row air-b",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	tableCollection: 'Appliances',
	modelView      : App.Views.ApplianceRowView,
});
App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template : HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',
	sync     : false,

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	awake: function(){
		this.listenTo(this.model, 'change:client_name', function(){
			this.updateViewText.apply(this, ['client_name']);
			this.invoke('setHeader');
		});
		this.listenTo(this.model, 'change:service_request_id', function(){
			this.$('[name=service_request_id]').attr('href', '#render/service_request/show/' + this.model.get('service_request_id'));
		});
		this.listenTo(this.model, 'change:client_id', function(){
			this.$('[name=client_name]').attr('href', '#render/client/show/' + this.model.get('client_id'));
		});
	},

	afterRender: function(){
		if (!this.formView){
			this.formView = new App.Views.ApplianceEditFormView({
				model: this.model,
			});
			this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
			this.invoke('setHeader');
		}
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},
});
App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'submit form'                        : function(e){e.preventDefault();},
		//'focus .bootstrap-tagsinput input'   : 'activateTags',
		//'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:status'          , function(){this.updateViewField.apply(this, ['status']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:repairement_type', function(){this.updateViewField.apply(this, ['repairement_type']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewText.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(this, 'disposing', this.removeTagsinput);
	},

	afterRender: function(){
		this.tagsinput();
		this.$('[name=serial]').focus();
	},

	tagsinput: function(){
		var self = this;
		this.removeTagsinput();
		this.$('[name=accessories]').tagsinput();
		this.$('.bootstrap-tagsinput input').on("focus"   , function(e){ self.activateTags(e); });
		this.$('.bootstrap-tagsinput input').on("focusout", function(e){ self.deactivateTags(e); });
	},

	removeTagsinput: function(){
		this.$('.bootstrap-tagsinput input').off('focus');
		this.$('.bootstrap-tagsinput input').off('focusout');
		this.$('.bootstrap-tagsinput').remove();
	}, 

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'serial',
			'observations',
			'repairement_type',
			'defect'
		));
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'), {silent: true});
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});
App.Views.ClientRowView = App.Views.RowView.extend({
	template : HBS.client_row_template,
	modelName: 'client',
});
App.Views.ClientDetailsView = App.Views.ShowView.extend({
	template: HBS.client_details_template,

	className: 'row',

	awake: function(){
		this.listenTo(this.model, 'sync', this.render);
	},

	afterRender: function(){
		this.invoke('setHeader');
	},

	serialize: function(){
		var result       = (App.defined(this.model)) ? this.model.toJSON() : {};
		var createdAt    = this.model.get('createdAt');
		var updatedAt    = this.model.get('updatedAt');
		result.createdAt = this.model.dateDDMMYYYY(createdAt);
		result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
		return result;
	},
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-md-12 col-lg-offset-1 col-lg-9',

	events: {
		'click #add-phone-number'        : 'addPhone',
		'click button.del-phone-number'  : 'delPhone',
		'click button.edit-phone-number' : 'editPhone',
		'click #add-address'             : 'addAddress',
		'click button.del-address'       : 'delAddress',
		'click button.edit-address'      : 'editAddress',
		'click #reset-form'              : 'resetForm',
		'click #update-form'             : 'updateModel',
		'click #edit-form'               : 'toggleButtons',
		'submit form'                    : 'createModel',
	},

	initialize: function(){
		this.bindEvents();
		this.cloneModelCollections();
	},

	cloneModelCollections: function(){
		if (!this.model){return;}
		var phones    = this.model.phones;
		var addresses = this.model.addresses;
		if(phones)   { this.phonesClone    = this.model.phones.clone(); }
		if(addresses){ this.addressesClone = this.model.addresses.clone(); }
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:phones'    , this.renderPhones);
		this.listenTo(this.model, 'change:addresses' , this.renderAddresses);
		this.listenTo(this.model, 'change:name'      , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:doc-type'  , function(){this.updateViewField.apply(this, ['doc-type']);});
		this.listenTo(this.model, 'change:doc-number', function(){this.updateViewField.apply(this, ['doc-number']);});
		this.listenTo(this.model, 'change:email'     , function(){this.updateViewField.apply(this, ['email']);});
	},

	afterRender: function(){
		this.renderPhones();
		this.renderAddresses();
		if(!this.model.isNew()){this.blockForm();}
	},

	resetForm: function(e){
		e.preventDefault();
		if (this.model && this.model.phones && this.phonesClone){
			this.model.phones.reset(this.phonesClone.models);
		}
		if (this.model && this.model.addresses && this.addressesClone){
			this.model.addresses.reset(this.addressesClone.models);
		}
		this.render();
	},

	blockForm: function(){
		//App.Views.BaseView.prototype.blockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').hide();
		this.$('[name=name]'      ).attr("readonly", true);
		this.$('[name=doc-type]'  ).attr("readonly", true);
		this.$('[name=doc-number]').attr("readonly", true);
		this.$('[name=email]'     ).attr("readonly", true);
		this.$('[name=phone]'     ).hide();
		this.$('[name=street]'    ).hide();
		this.$('[name=city]'      ).hide();
		this.$('[name=department]').hide();
		this.$('[name=address-edit-row]').hide();
		this.$('.form-control-under label[for=address]').show();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	unblockForm: function(){
		//App.Views.BaseView.prototype.unblockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').show();
		this.$('[name=name]'      ).attr("readonly", false);
		this.$('[name=doc-type]'  ).attr("readonly", false);
		this.$('[name=doc-number]').attr("readonly", false);
		this.$('[name=email]'     ).attr("readonly", false);
		this.$('[name=phone]'     ).show();
		this.$('[name=street]'    ).show();
		this.$('[name=city]'      ).show();
		this.$('[name=department]').show();
		this.$('[name=address-edit-row]').show();
		this.$('.form-control-under label[for=address]').hide();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	toggleButtons: function(){
		if (this.$('#update-form').hasClass('hide')){
			this.unblockForm();
		} else {
			this.blockForm();
		}
		this.$('.update-buttons').toggleClass('hide');
	},

	renderPhones: function(){
		this.$('#phone-numbers').html(this.phoneFieldTemplate({
			phones : this.model.phones.toJSON()
		}));
		this.$('[name=phone]').focus();
	},

	addPhone: function(){
		var number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.phones.add({number: number});
	},

	delPhone:function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		this.model.phones.remove(this.model.phones.at(index));
	},

	editPhone: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		var phone = this.model.phones.at(index);
		this.delPhone(index);
		this.$('[name=phone]').val(phone.get('number'));
	},

	renderAddresses: function(){
		this.$('#addresses').html(this.addressFieldTemplate({
			addresses : this.model.addresses.toJSON()
		}));
		this.$('[name=street]').focus();
		this.$('.form-control-under label[for=address]').hide();
	},

	addAddress: function(){
		var attrs = _.pick(this.$('form').formParams(), 'street', 'city', 'department');
		if(attrs.street === ""){return;}
		this.model.addresses.add(attrs);
	},

	delAddress: function(e){//
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		this.model.addresses.remove(this.model.addresses.at(index));
	},

	editAddress: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		var address = this.model.addresses.at(index);
		this.delAddress(index);
		this.$('[name=street]').val(address.get('street'));
		this.$('[name=city]').val(address.get('city'));
		this.$('[name=department]').val(address.get('department'));
	},

	setModel: function(){
		this.model.set(_.pick(this.$('form').formParams(), 'name', 'email', 'doc-type', 'doc-number'));
		if(this.$('[name=phone]').val()  !== ''){ this.addPhone(); }
		if(this.$('[name=street]').val() !== ''){ this.addAddress(); }
	},

	createModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Cliente Creado',
					message: 'El nuevo cliente se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model = app.storage.newModel("clients");
		this.bindEvents();
		this.render();
		this.$('[name=name]').focus();
	},

	updateModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		this.setModel();
		this.toggleButtons();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Datos Actualizados',
					message: 'El cliente se ha actualizado correctamente',
					class  : 'success',
				});
			},
		});
		this.cloneModelCollections();
	},

	dispose: function(){
		if (this.phonesClone)   { this.phonesClone.dispose(); }
		if (this.addressesClone){ this.addressesClone.dispose(); }
		Giraffe.dispose.apply(this, arguments);
	},

});
App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "row",
	name     : "Clientes",
	
	tableEl        : '#clients-table',
	tableCollection: 'Clients',
	modelView      : App.Views.ClientRowView,
	
	fetchOptions		: {
		data: {
			fields: '-service_requests'
		}
	},
});
App.Views.ClientNewView = App.Views.NewView.extend({	
	name        : "Nuevo Cliente",
	formViewName: "ClientFormView",
});
App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.clientIndex = new App.Views.ClientIndexView({
			collection: app.storage.getCollection("clients"),
			synced: true,
		});
		this.clientIndex.selection = true;
		this.clientIndex.attachTo('#client-index');
	},
});
App.Views.ClientShowView = App.Views.TabView.extend({
	modelId     : null,
	modelName   : 'client',
	fetchOptions: {
		data: {
			fields: '-service_requests',
		}
	},
	
	name: function(){
		return 'Cliente: ' + this.model.get('name') + ' #' + this.model.get('id');
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ClientDetailsView',
			active: true,
		},
		{
			id            : 'service_requests',
			title         : 'Ordenes de Servicio',
			class         : 'air-t',
			renderFunction: function(){
				this.renderServiceRequests();
			},
		},
		{
			id   : 'edit',
			title: 'Editar Datos',
			class: 'air-t row',
			view : 'ClientFormView',
		}
	],

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var self = this;
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: app.storage.getSubCollection("service_requests", {
					client_id: this.model.id,
				}, {
					success: function(){
						self.serviceRequests.attachTo(
							self.$('#client-service_requests-'+ self.timestamp), 
							{method: 'html'}
						);
					}
				}),
				synced: true,
			});
		}
	},
});
App.Views.BreadCrumbsView = Giraffe.View.extend({
	template: HBS.breadcrumbs_template,
	className: 'row',
});
App.Views.AlertsLayoutView = Giraffe.View.extend({
	template: HBS.alerts_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.BSCalloutView = App.Views.BaseView.extend({
	template: HBS.bs_callout_template,

	className: "bs-callout",

	lifetime: 4000,

	events: {
		'click .close': 'closeCallout',
		'click button': 'triggerEvent',
	},

	triggerEvent: function(e){
		var event = e.currentTarget.dataset.event;
		app.trigger(event);
	},

	afterRender: function(){
		var self      = this;
		var className = this.model.get('class');
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(this.lifetime > 0){
			this.timer = setTimeout(function(){
				self.dispose();
			}, this.lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},

	closeCallout: function(){
		if(App.defined(this.timer)){
			clearTimeout(this.timer);
		}
		this.dispose();
	},
});
App.Views.GoToTopView = App.Views.BaseView.extend({
	template: HBS.go_to_top_template,

	winH: 0,
	winW: 0,
	win: null,

	events: {
		'click': function(e){e.preventDefault(); App.scrollTo(0);},
	},

	initialize: function(){
		var self = this;
		this.win = $(window);
		this.win.scroll(function(){
			self.toggleViewOnOverflow();
		});
	},

	afterRender: function(){
		this.toggleViewOnOverflow();
		this.$el.tooltip();
	},

	windowHeight: function(){
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			this.winW = window.innerWidth;
			this.winH = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			this.winW = document.documentElement.clientWidth;
			this.winH = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			this.winW = document.body.clientWidth;
			this.winH = document.body.clientHeight;
		}
	},

	toggleViewOnOverflow: function(){
		if(this.win.scrollTop() > 300){
			this.$el.fadeIn();
		} else {
			this.$el.fadeOut();
		}
	},
});
App.Views.MessagesLayoutView = Giraffe.View.extend({
	template: HBS.messages_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.ModalController = App.Views.BaseView.extend({
	currentModal: null,
	callerView  : null,
	callerMethod: null,

	tagName     : 'section',
	id          : 'modal-el',
	
	events: {
		'click .close-modal': 'closeModal',
	},

	displayModal: function(view, callerView, callerMethod){
		if (callerView)   {this.callerView   = callerView;}
		if (callerMethod) {this.callerMethod = callerMethod;}
		if(!App.defined(this.currentModal) || this.currentModal.bodyView.cid !== view.cid){
			this.setCurrentModal(view);
		}	
		this.$('#modalContainer').modal('show');
	},

	setCurrentModal: function(view){
		this.currentModal = new App.Views.ModalView({bodyView: view});
		this.attach(this.currentModal, {el: this.el, method: 'html'});
	},

	closeModal: function(){
		this.$('#modalContainer').modal('hide');
		this.callerView   = null;
		this.callerMethod = null;
	},

	runCallerMethod: function(data){
		if(!App.defined(this.callerView) || !App.defined(this.callerMethod)){return;}
		var method = this.callerView[this.callerMethod];
		if(!_.isFunction(method)){return;}
		method.call(this.callerView, data);
		this.closeModal();
	},
});
App.Views.NavView = Giraffe.View.extend({
	template: HBS.nav_template,
	tagName: 'nav',
	attributes: function(){
		return {
			'class': "navbar navbar-inverse navbar-static-top",
			'role': "navigation", 
			'style': "margin-bottom: 0" 
		};
	},

	initialize: function(){
		this.toggleSidebar = _.throttle(this.toggleSidebar, 600);
	},

	events: {
		'click #toggle-sidebar': 'toggleSidebar',
		'click .navbar-brand'  : 'toggleSidebar'
	},

	afterRender: function(){
		this.messagesLayout   = new App.Views.MessagesLayoutView();
		this.tasksLayout      = new App.Views.TasksLayoutView();
		this.alertsLayout     = new App.Views.AlertsLayoutView();
		this.userSettingsView = new App.Views.UserSettingsView();
		this.messagesLayout.attachTo('#nav-monitor-el');
		this.tasksLayout.attachTo('#nav-monitor-el');
		this.alertsLayout.attachTo('#nav-monitor-el');
		this.userSettingsView.attachTo('#nav-monitor-el');
	},

	toggleSidebar: function(e){
		e.preventDefault();
		var wrapper    = $('#page-wrapper');
		var whiteSpace = $('#white-space');
		var sidebar    = $('#sidebar-el');
		wrapper.toggleClass('make-space-right');
		whiteSpace.toggleClass('make-space-right');
		app.trigger('nav:toggleMenu');
	},
});
App.Views.PortletView = App.Views.BaseView.extend({
	template: HBS.portlet_template,

	className: "row",

	view             : null,
	viewName         : null,
	portletFrameClass: null,
	flash            : null,
	entrance         : 'fadeInLeft',

	appEvents: {
		'portlet:message': 'message',
	},

	events: {
		'click #close'   : 'closeView',
		'click #sync'    : 'syncView',
		'click #collapse': 'collapseView',
	},

	afterRender: function(options){
		this.setFrame();
		this.setMainChildView();
		this.startTooltips();
		this.displayFlash();
		this.setHeader();
	},

	collapseView: function(){
		this.$('#collapse i').toggleClass('fa-chevron-uo').toggleClass('fa-chevron-down');
	},

	syncView: function(e){
		e.preventDefault();
		if (App.defined(this.view)){
			if(this.view.canSync()){
				this.$('#sync i').removeClass('fa-undo').addClass('fa-spinner fa-spin');
			} else {
				this.flash = {
					title  : 'Atención',
					message: 'Esta ventana no se puede sincronizar',
					class  : 'warning',
					method : 'html' 
				};
				this.displayFlash();
			}
		}
	},

	stopSpin: function(){
		if (this.$('#sync i').hasClass('fa-spinner')) {
			this.$('#sync i').removeClass('fa-spinner fa-spin').addClass('fa-undo');
			this.showMessage({
				title  : 'Datos Actualizados',
				message: 'Los datos se han actualizado correctamente',
				class  : 'success',
			});
		}
	},

	displayFlash: function(){
		if (App.defined(this.flash)){
			this.showMessage(this.flash);
			this.flash = null;
		}
	},

	startTooltips: function(){
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setMainChildView: function(){
		if(!App.defined(this.viewName)){return new Error('ViewName must be set');}
		if(!this.view){
				this.view = new App.Views[this.viewName]();
		}
		this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
		this.listenTo(this.app, 'portlet:view: '+ this.view.cid +':sync:spin:stop', this.stopSpin);
	},

	setHeader: function(){
		this.$('#portlet-title-header').text(_.result(this.view, 'name'));
	},

	setFrame: function(){
		if(App.defined(this.portletFrameClass)){
			this.$('#portlet-frame').addClass('portlet-' + this.portletFrameClass);
		}
	},

	message: function(data){
		if (!App.defined(data) && !App.defined(data.viewCid)){
			return;
		}
		if (this.view.cid === data.viewCid){
			delete data.viewCid;
			this.showMessage(data);
		}
	},

	showMessage: function(data){
		var options = {};
		var method  = 'prepend';
		if(App.defined(data.lifetime)){
			options.lifetime = data.lifetime;
			delete data.lifetime;
		}
		if(data.method){
			method = data.method;
			delete data.method;
		}
		options.model = new Backbone.Model(data);
		var callout   = new App.Views.BSCalloutView(options);
		this.attach(callout, {el: this.$('#portlet-messages'), method: method});
	},

	serialize: function(){
		return {
			cid: this.cid,
		};
	},

	closePortletView: function(){
		this.dispose();
	},
});
App.Views.SearchView = App.Views.BaseView.extend({
	template: HBS.search_template,
	className: "input-group custom-search-form",
});
App.Views.SideNavView = App.Views.BaseView.extend({
	template: HBS.side_nav_template,

	show: true,

	tagName: 'nav',
	attributes: function(){
		return {
			'class': 'navbar-inverse navbar-static-side animated fadeInLeft',
			'role' : 'navigation',
		};
	},

	appEvents: {
		'nav:toggleMenu': 'toggleMenu',
	},

	events: {
		'click ul#side-menu li a'       : 'activateLi',
		'click ul.nav-second-level li a': 'activateSecondLi',
	},

	afterRender: function(){
    this.$('#side-menu').metisMenu();
    this.searchView = new App.Views.SearchView();
    this.searchView.attachTo('ul#side-menu li.sidebar-search');
	},

	activateLi: function(e){
		this.$('ul#side-menu li a').removeClass('active');
		this.$(e.currentTarget).closest('a').addClass('active');
	},

	activateSecondLi: function(e){
		this.$('ul.nav-second-level li a').removeClass('second-level-active');
		this.$(e.currentTarget).closest('a').addClass('second-level-active');
	},

	toggleMenu: function(){
		if(this.show){
			this.show = false;
			this.$el.removeClass('slideInLeft').addClass('slideOutLeft');
		} else {
			this.show = true;
			this.$el.removeClass('slideOutLeft').addClass('slideInLeft');
		}
	},
});
App.Views.TasksLayoutView = Giraffe.View.extend({
	template: HBS.tasks_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.UserSettingsView = Giraffe.View.extend({
	template: HBS.user_settings_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.ModelRowView = App.Views.RowView.extend({
	template : HBS.model_row_template,
	modelName: 'model',
});
App.Views.ModelDetailsView = App.Views.ShowView.extend({
	template: HBS.model_details_template,
	className: 'row',

	awake: function(){
		_.once(this.renderApplianceIndex);
	},

	afterRender: function(){
		this.renderApplianceIndex();
		this.invoke('setHeader');
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model)){return;}
		var self = this;
		var el   = this.$('#model-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced: true,
			collection   : app.storage.getSubCollection("appliances", {
				model_id: this.model.id
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});
App.Views.ModelFormView = App.Views.FormView.extend({
	template: HBS.model_form_template,
	storage : 'models',
	focus   : '[name=brand]',

	createSuccessMessage: {
		title  : 'Modelo Creado',
		message: 'El nuevo modelo se ha creado con exito.',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	updateSuccessMessage: {
		title  : 'Modelo Actualizado',
		message: 'El modelo se ha actualizado con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:model'       , function(){this.updateViewField.apply(this, ['model']);});
		this.listenTo(this.model, 'change:brand'       , function(){this.updateViewField.apply(this, ['brand']);});
		this.listenTo(this.model, 'change:category'    , function(){this.updateViewField.apply(this, ['category']);});
		this.listenTo(this.model, 'change:subcategory' , function(){this.updateViewField.apply(this, ['subcategory']);});
	},
});
App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modelos",
	
	tableEl        : '#models-table',
	tableCollection: 'Models',
	modelView      : App.Views.ModelRowView,

	fetchOptions		: {
		data: {
			fields: 'brand model category subcategory _id'
		}
	},
});
App.Views.ModelNewView = App.Views.NewView.extend({
	name        : "Nuevo Modelo",
	formViewName: "ModelFormView",
	modelName   : "Model",
});
App.Views.ModelSelectModalView = App.Views.BaseView.extend({
	template: HBS.model_select_modal_template,
	
	name      : "ModelSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Modelo",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.modelIndex = new App.Views.ModelIndexView({
			collection: app.storage.getCollection("models"),
			synced    : true,
		});
		this.modelIndex.selection  = true;
		this.modelIndex.parentView = this.parentView;
		this.modelIndex.attachTo('#model-index');
	},
});
App.Views.ModelShowView = App.Views.TabView.extend({
	name: function(){
		if (this.model){
			return 'Equipos con modelo ' + this.model.get('model');
		}
	},

	fetchOptions: {
		data: {
			fields: '-appliances',
		}
	},

	modelName: 'model',

	awake: function(){
		_.once(this.renderEditForm);
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ModelDetailsView',
			active: true,
		},
		{
			id            : 'edit',
			title         : 'Editar Datos',
			class         : 'air-t',
			renderFunction: function(){
				this.renderEditForm();
			},
		}
	],

	renderEditForm: function(){
		this.editForm = new App.Views.ModelFormView({
			model    : this.model,
			edit     : true,
			className: 'row',
		});
		this.editForm.attachTo(this.$('#model-edit-'+ this.timestamp), {method: 'html'});
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},
});
App.Views.ServiceRequestRowView = App.Views.RowView.extend({
	template : HBS.service_request_row_template,
	modelName: "service_request",
	
	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.serialize();
			var createdAt = this.model.get('createdAt');
			if (App.defined(createdAt)){
				object.createdAt = this.model.dateDDMMYYYY(createdAt);
			}
		}
		return object;
	},
});
App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	awake: function(){
		_.once(this.renderApplianceIndex);
		this.listenTo(this.model, 'change:client_name', function(){this.updateViewText.apply(this, ['client_name']);});
		this.listenTo(this.model, 'change:status', function(){this.updateViewText.apply(this, ['status']);});
		this.listenTo(this.model, 'change:invoiceNumber', function(){
			this.updateViewText.apply(this, ['invoiceNumber']);
			if (this.model.get('invoiceNumber') === ''){ 
				this.$('[name=invoiceText]').addClass("hide"); 
			} else {
				this.$('[name=invoiceText]').removeClass("hide");
			}
		});
		this.listenTo(this.model, 'change:client_id', function(){
			this.$('[name=client_name]').attr('href', '#render/client/show/' + this.model.get('client_id'));
		});
	},

	afterRender: function(){
		this.renderApplianceIndex();
		this.invoke('setHeader');
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model)){return;}
		var self = this;
		var el = this.$('#service-request-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced       : true,
			collection   : app.storage.getSubCollection("appliances", {
				service_request_id: this.model.id,
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});
App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
		'click button[type=submit]'    : 'createServiceRequest',
		'click button#select-client'   : 'selectClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'change:client_name'  , function(){this.updateViewField.apply(this, ['client_name']);});
		this.listenTo(this.model, 'change:invoiceNumber', function(){this.updateViewField.apply(this, ['invoiceNumber']);});
		this.model.appliances = new App.Collections.Appliances();
		this.listenTo(this.model.appliances, 'change', this.setAppliances);
		this.listenTo(this.model.appliances, 'remove', this.setAppliances);
		this.listenTo(this, 'disposing', function(){
			this.model.appliances.dispose();
			this.model.appliances = undefined;
		});
	},

	setAppliances: function(){
		this.model.set('appliances', this.model.appliances.toJSON());
	},
	
	afterRender: function(){
		this.$el.tooltip();
		if (this.model && this.model.get('client_name') && this.model.get('client_id')){
			this.$('.btn-success').attr('disabled', false);
		}
	},

	serviceRequestSuccessFlash: function(){
		return {
			title   : 'Orden de Servicio Creada',
			message : 'La Orden de Servicio se ha creado con exito!.',
			class   : 'success',
			method  : 'html',
		};
	},

	zeroAppliancesFlash: {
		title  : 'Atención',
		message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
		class  : 'warning',
		method : 'html' 
	},

	selectClient: function(){
		if(!this.clientSelectModalView){
			this.clientSelectModalView = new App.Views.ClientSelectModalView();
		}
		app.modalController.displayModal(this.clientSelectModalView, this, 'clientSelected');
	},

	clientSelected: function(model){
		this.model.set('client_id', model.get('_id'));
		this.model.set('client_name', model.get('name'));
		this.$('.btn-success').attr('disabled', false);
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		var model = app.storage.newModel("appliances");
		model.set({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id')
		});
		this.$('button[type=submit]').attr('disabled', false);
		this.model.appliances.add(model);
		this.appendApplianceForm(model);
	},

	appendApplianceForm: function(model, view){
		var appliances = this.model.appliances;
		if (model && !view){
			view = new App.Views.ApplianceSingleFormView({ model : model });
			view.listenTo(view.model, 'remove', function(){ view.dispose(); });
			this.addChild(view);
		} else if (!model && view) {
			model = view.model;
		}
		var index = appliances.indexOf(model);
		var style = (index % 2) ? 'background-color: #fff' : 'background-color: #E6E6E6';
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
		if(index === (appliances.length - 1)){
			App.scrollTo(view.$el);
		}
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self       = this;
		var index      = e.currentTarget.dataset.index;
		var appliance  = this.model.appliances.at(index);
		appliance.dispose();
		this.$('#appliance-views').empty();
		_.each(this.children, function(view){
			self.appendApplianceForm(null, view);
			view.tagsinput();
		});
		if(this.model.appliances.length === 0){//
			this.$('button[type=submit]').attr('disabled', true);
		}
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		if (this.model.appliances.length === 0){
			return this.invoke('showMessage', this.zeroAppliancesFlash);
		}
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		this.model.save(null, {
			success: function(model, response, options){
				var route = 'service_request/show/' + model.id;
				Backbone.history.navigate(route);
				self.stopListening(model.appliances);
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					viewType         : 'show',
					model            : model,
					fetch            : false,
					portletFrameClass: 'green',
				flash            : self.serviceRequestSuccessFlash()
				});
				self.invoke('closePortletView');
			},
		});
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'client_id',
			'client_name',
			'invoiceNumber'
		));
	},
});
App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "row",
	name     : "Ordenes de Servicio",
	
	tableEl        : '#service_requests-table',
	tableCollection: 'ServiceRequests',
	modelView      : App.Views.ServiceRequestRowView,

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	comparator: function(portletView){
		return (
				portletView instanceof App.Views.PortletView &&
				portletView.viewName === "ServiceRequestNewView" &&
				App.defined(portletView.view) &&
				App.defined(portletView.view.model) &&
				portletView.view.model.get('client_id') === this.parent.model.id
			);
	},

	newServiceRequest: function(){
		if(!this.parent.model || !(this.parent.model instanceof App.Models.Client)){
			Backbone.history.navigate('render/service_request/new', {trigger: true});
			return;
		}
		var targetView = app.Renderer.viewIsRendered(this.comparator, this);
		if (targetView){
			return App.scrollTo(targetView.el);
		}
		var parentModel = this.parent.model;
		var object = {
			client_name: parentModel.get('name'),
			client_id  : parentModel.get('_id')
		};
		var model = new app.storage.newModel("service_requests").set(object);
		app.Renderer.show({
			viewName: 'ServiceRequestNewView',
			viewType: 'new',
			storage : "service_requests",
			model   : model
		});
	},
});
App.Views.ServiceRequestNewView = App.Views.NewView.extend({
	className: "row",
	formViewName: "ServiceRequestFormView",

	initialize: function(){
		this.listenTo(this.model, 'change:client_name', function(){
			this.invoke('setHeader');
		});
	},
	
	name: function(){
		var clientName, clientID;
		var result = "Nueva Orden de Servicio";
		if (!App.defined(this.model)){return result;}
		clientName = this.model.get('client_name');
		clientID   = this.model.get('client_id');
		if(App.defined(clientName) && App.defined(clientID)){
			return "Nueva Orden de Servicio para " + clientName;
		} else {
			return result;
		}
	},
});
App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	name     : function(){
		if (this.model){
			return 'Orden de Servicio #' + this.model.get('id');
		}
	},

	modelId  : null,
	modelName: 'service_request',

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ServiceRequestDetailsView',
			active: true,
		},
		{
			id            : 'appliances',
			title         : 'Equipos',
			renderFunction: function(){
				this.renderAppliancesCarousel();
			},
		}
	],

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
		this.listenTo(this.model, 'sync', function(){this.invoke('setHeader');});
	},

	renderAppliancesCarousel: function(){
		if (!this.appliancesCarousel){
			if (!this.model){return;}
			var self = this;
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				synced: true,
				collection : app.storage.getSubCollection('appliances', {
					service_request_id: this.model.id
				}, {
					success: function(){
						self.appliancesCarousel.attachTo(
							self.$('#' + self.modelName + '-appliances-' + self.timestamp), 
							{
								method: 'html',
							}
						);
					}
				})
			});
		}
	},
});
App.Views.UserRowView = App.Views.RowView.extend({
	template : HBS.user_row_template,
	modelName: 'user',
});
App.Views.TechIndexView = App.Views.TableView.extend({
	template : HBS.tech_index_template,
	className: "row",
	name     : "Tecnicos",
	
	tableEl        : '#techs-table',
	modelView      : App.Views.UserRowView,

	fetchOptions: {
		data: {
			techs: true,
		}
	}
});
App.Views.UserDetailsView = App.Views.ShowView.extend({
	template: HBS.user_details_template,
	className: 'row',

	afterRender: function(){
		this.invoke('setHeader');
		this.listenTo(this.model, 'sync', this.render);
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});
App.Views.UserFormView = App.Views.FormView.extend({
	template: HBS.user_form_template,
	storage : 'models',
	focus   : '[name=name]',

	initialize: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:name' , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:email', function(){this.updateViewField.apply(this, ['email']);});
		this.listenTo(this.model, 'change:permissions', this.updateRoleField);
	},

	afterRender: function(){
		App.Views.FormView.prototype.afterRender.apply(this, arguments);
	},

	updateRoleField: function(role){
		var permissions = this.model.get("permissions");
		this.$('[name=isTech]' ).prop("checked", permissions.roles.isTech);
		this.$('[name=isAdmin]').prop("checked", permissions.roles.isAdmin);
		this.model.trigger("roles:change");
	},

	saveModel: function(){
		var attrs = _.pick(this.$('form').formParams(), 'name', 'email');
		attrs.permissions = this.getPermissions();
		this.model.set(attrs);
	},

	getPermissions: function(){
		return {
			roles: {
				isAdmin: this.$('[name=isAdmin]').is(':checked'),
				isTech : this.$('[name=isTech]').is(':checked'),
			}
		};
	},
});
App.Views.UserIndexView = App.Views.TableView.extend({
	template : HBS.user_index_template,
	className: "row",
	name     : "Usuarios",
	
	tableEl        : '#users-table',
	modelView      : App.Views.UserRowView,
});
App.Views.UserNewView = App.Views.NewView.extend({
	name        : "Nuevo Usuario",
	formViewName: "UserFormView",
	modelName   : "User",
});
App.Views.UserShowView = App.Views.TabView.extend({
	name: function(){
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			return 'Tecnico: ' + this.model.get('name');
		}
		return 'Usuario: ' + this.model.get('name');
	},

	modelId  : null,
	modelName: 'user',

	awake: function(){
		this.listenTo(this.model, "roles:change", this.techTab);
	},

	techTab: function(){
		var self = this;
		var tab  = this.$('#user-appliances');
		var permissions = this.model.get("permissions");
		if (!permissions || !permissions.roles)                       { return; }
		if (this.appliancesIndex && permissions.roles.isTech === true){ return; }
		if (permissions.roles.isTech === true && tab.length > 0)      { return; }
		if (permissions.roles.isTech === true && tab.length === 0){
			this.$('#user-edit').parent().before(
				'<li><a href="#user-appliances-'+this.timestamp+'" data-toggle="tab" id="user-appliances">Equipos</a></li>'
			);
			this.$('#user-edit-' + this.timestamp).before(
				'<div class="tab-pane fade in air-t" id="user-appliances-'+this.timestamp+'"></div>'
			);
			this.$('#user-appliances').on("click", function(e){
				self.$('#user-appliances').off("click");
				self.renderAppliances();
			});
			return;
		}
		if (permissions.roles.isTech === false && tab){
			tab.parent().remove();
			if (this.appliancesIndex){ this.appliancesIndex.dispose(); this.appliancesIndex = undefined; }
			this.$('#user-appliances-'+this.timestamp).remove();
		}
	},

	tabs: function(){
		var tabs = [
			{
				id    : 'details',
				title : 'Detalle',
				view  : 'UserDetailsView',
				active: true,
			},
			{
				id            : 'edit',
				title         : 'Editar Datos',
				class         : 'air-t',
				renderFunction: function(){
					this.renderEditForm();
				},
			}
		];
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			tabs.splice(1, 0, {
				id: 'appliances',
				title: 'Equipos',
				class : 'air-t',
				renderFunction: function(){
					this.renderAppliances();
				},
			});
		}
		return tabs;
	},

	renderAppliances: function(){
		if (!App.defined(this.model) || App.defined(this.appliancesIndex)){return;}
		var self = this;
		var el   = this.$('#user-appliances-'+ this.timestamp);
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced: true,
			collection   : app.storage.getSubCollection("appliances", {
				technician_id: this.model.id
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	renderEditForm: function(){
		if(App.defined(this.editForm)){return;}
		this.editForm = new App.Views.UserFormView({
			model    : this.model,
			edit     : true,
			className: 'row',
		});
		this.editForm.attachTo(this.$('#user-edit-'+ this.timestamp), {method: 'html'});
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},
});
App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/show/:id'                     : 'render:show',
		'render/:doc/:type'                        : 'render:doc',
		':doc/show/:id'                            : 'render:show',
		':doc/:type'                               : 'render:doc',
	},
});
App.GiraffeApp = Giraffe.App.extend({
	attributes: function(){
		return {
			'id': 'content-el',
		};
	},
});

var app = new App.GiraffeApp();

// Configure Ajax to use CSRF
app.addInitializer(function(){
	$.ajaxSetup({
    headers: {
      'X-CSRF-Token': csrf
    }
  });
});

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Build SideNav
app.addInitializer(function(options){
	app.sideNav = new App.Views.SideNavView();
	app.sideNav.attachTo('#sidebar-el');
});

// Build Modal Controller View
app.addInitializer(function(){
	app.modalController = new App.Views.ModalController();
	app.modalController.attachTo('#wrapper');
});

// Build Scroller
app.addInitializer(function(options){
	app.GoToTopView = new App.Views.GoToTopView();
	app.GoToTopView.attachTo('#scroller-el');
});

// Add an easy access for the storage on the app object
app.addInitializer(function(){
	app.storage = App.Storage.getInstance();
	app.storage.collection("models").add(models);
	app.storage.collection("clients").add(clients);
	app.storage.collection("users").add(techs);
	clients = undefined;
	models  = undefined;
	techs   = undefined;
});

// Start Backbone History, Renderer and main router
app.addInitializer(function(){
	app.Renderer   = new App.Views.Renderer();
	app.MainRouter = new App.Routers.MainRouter();
	Backbone.history.start();
});

$(document).ready(function(){
	app.attachTo('section#page-wrapper');
	app.start();
});