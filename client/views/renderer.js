App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.titelize(doc);
		var viewName = docName + 'ShowView';
		var params   = {
			model            : docName,
			viewName         : viewName,
			portletFrameClass: 'green',
			options          : {
				_id: id,
			},
		};
		this.showOrGoTo(params, this.showComparator);
	},

	docView: function(doc, type){
		var docName  = this.titelize(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		var params   = {
			viewName: viewName,
		};
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
			portletView.view.model.id === this.options._id
		);
	},

	showOrGoTo: function(params, comparator){
		if(	!App.defined(params)										|| 
				!App.defined(params.viewName)						|| 
				!App.defined(App.Views[params.viewName])
		){
			return;
		}
		var viewRef;
		Backbone.history.navigate((Backbone.history.fragment).replace('render/', ''));
		params     = (params)     ? params     : {};
		comparator = (comparator) ? comparator : this.defaultComparator;
		viewRef    = this.viewIsRendered(comparator, params);
		if (viewRef){
			App.scrollTo(viewRef.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		var portletView, fetchOptions, fetch;
		var viewOptions = {};
		// If no params object is passed or the viewName is not defined then return
		if(!_.isObject(params) || !App.defined(params.viewName)){
			return new Error('The viewName option must be set');
		}
		// If a model is necessary then instantiate it, then check the view for any
		// special fetch options. Then append the model to the view and fetch the data.
		if(params.model){
			var modelOptions  = (params.options) ? (params.options) : {}; 
			if (_.isString(params.model)){
				viewOptions.model = new App.Models[params.model](modelOptions);
				fetch = true;
			} else {
				viewOptions.model = params.model;
			}
			delete params.model;
			delete params.options;
		}	
		// We create the correct view
		params.view = new App.Views[params.viewName](viewOptions);
		// Grab the fetchOptions from the new view and fetch the model if it exists
		if (fetch){
			fetchOptions        = (params.view.fetchOptions) ? params.view.fetchOptions : {};
			fetchOptions.silent = true;
			params.view.model.fetch(fetchOptions);
		}
		// Instantiate the portletView with the necessary params and append it to the
		// main content.
		portletView = new App.Views.PortletView(params);
		this.appendToContent(portletView);
		App.scrollTo(portletView.el);
	},

	viewIsRendered: function(comparator, context){
		var self = (context) ? context : this;
		var result = null;
		_.each(app.children, function(view){
			if(comparator.apply(self, [view])){
				result = view;
			}
		});
		return result;
	},

	appendToContent: function(view){
		app.attach(view, {el: '#content-el', method: 'prepend'});
	},
});