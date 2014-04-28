App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.titelize(doc);
		var viewName = docName + 'ShowView';
		var model    = this.setModel(doc, id);
		var params   = {
			model            : model,
			viewName         : viewName,
			portletFrameClass: 'green',
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

	setModel: function(doc, id){
		var model;
		var collection = app[doc + 's'];
		var docName    = this.titelize(doc);
		if (App.defined(collection)){
			model = collection.get(id);
		} else {
			model = new App.Models[docName]({_id: id});
			model.fetch();
		}
		return model;
	},

	defaultComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&& 
			App.defined(view.viewName)							&& 
			view.viewName === this.viewName
		);
	},

	showComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&&
			App.defined(view.view)									&&
			App.defined(view.view.model)						&&
			view.view.model.id === this.model.id
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
		if(!App.defined(params) || !params.viewName){
			return new Error('The viewName option must be set');
		}
		var options = {};
		if(params.model){
			options.model = params.model;
			delete params.model;
		}
		params.view     = new App.Views[params.viewName](options);
		var portletView = new App.Views.PortletView(params);
		//if(options.model){
		//	portletView.view.model.fetch();
		//}
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