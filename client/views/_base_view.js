App.Views.BaseView = Giraffe.View.extend({
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
		app.trigger('portlet:view: '+ this.cid +':sync:spin:stop');
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
	announce: function(){
		if(!App.defined(this.model)){return;}
		app.trigger(this.modelName + ':show:active', this.model.id);
	},
});