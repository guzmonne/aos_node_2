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
		if (App.defined(this.onSync)){ this.onSync(); return true; } else { return false; }
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be called after the onSync() method ends to stop the portlet spinner
	// ------------
	// !!!
	afterSync: function(message){
		this.invoke("stopSpin", message);
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
  },

	sync: function(type, options){
		if (!type){return;}
		var success, self = this;
		options        = (options) ? options : {};
		success        = options.success;
		options.remove = (options.remove)    ? options.remove    : true;
		options.add    = (options.add)       ? options.add       : true;
		options.merge  = (options.merge)     ? options.merge     : true;
		options.success = function(){
			if (success) {success.apply(this, arguments);}
			self.afterSync();
		};
		if (type === "model" && this.model){
			this.model.fetch(options);
		}
		if (type === "collection" && this.collection){
			this.collection.fetch(options);
		}
  },

  invokeSetHeader: function(){
		this.invoke('setHeader');
	},

	print: function(e){
		e.preventDefault();
		var model = this.getModelFromTarget(e);
		if (_.isUndefined(model)){return;}
		model.pdfReportPrint();
	},

	download: function(e){
		e.preventDefault();
		var model = this.getModelFromTarget(e);
		if (_.isUndefined(model)){return;}
		fileName = (_.isFunction(this.reportName)) ? this.reportName(model) : 'file.pdf';
		model.pdfReportDownload(fileName);
	},

	getModelFromTarget: function(e){
		var model, id = this.$(e.target).closest('a').data('id');
		try {
			model = app.storage.get(this.collectionName, id);
		} catch (err) {
			console.log(err.stack); return undefined;
		}
		return model;
	},
});