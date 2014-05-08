App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',
	name       : '',

	url: function(){
		var url = "";
		if (this.name){
			url = '/api/' + this.name;
			if (this.id){
				url = url + '/' + this.id;
			}
		}
		return url; 
	},

	initialize: function(attributes, options){
		if (_.isFunction(this.awake)){this.awake(attributes, options);}
		this.listenTo(this, 'sync'                      , this.modelUpdated);
		this.listenTo(app , this.name + ':model:updated', this.updateModel);
		this.listenTo(app, 'active', function(){console.log(this.cid);});
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

	// Modified Backbone.Model.sync() funtion to add an event call if a new model is created
	sync: function(method, model, options) {
		var self    = this;
		options     = (options) ? _.clone(options) : {};
		var success = options.success;
		if (method === 'create'){
			options.success = _.wrap(options.success, function(fun){
				if(_.isFunction(self.beforeSuccessfulCreate)){
					self.beforeSuccessfulCreate(arguments[1]);
				}
				// This will make the model trigger this event on success passing the data
				// sent by the server.
				// arguments[1] = model || arguments[2] = response || arguments[3] = options
				app.trigger(self.name + ':model:created', arguments[1]);
				if (fun){fun(arguments[1], arguments[2], arguments[3]);}
				if(_.isFunction(self.afterSuccessfulCreate)){
					self.afterSuccessfulCreate(arguments[1]);
				}
			});
		}
    return Backbone.sync.apply(this, [method, model, options]);
  },

  setParent: function(parent){
		this.parent = parent;
		this.listenTo(parent, 'disposed', this.dispose);
  },
});