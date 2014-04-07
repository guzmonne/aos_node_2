App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.titelize(doc);
		var viewName = docName + 'ShowView';
		var params   = {
			viewModelId      : id,
			viewName         : viewName,
			portletFrameClass: 'green',
		};
		this.checkViewName(params, doc + '/show/' + id, this.showComparator);
		//this.checkViewName(viewName, doc + '/show/' + id, params);
	},

	docView: function(doc, type){
		var docName  = this.titelize(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		var params   = {
			viewName: viewName,
		};
		this.checkViewName(params, doc + '/' + type);
	},

	checkViewName: function(params, route, comparator){
		if(
			App.defined(params)						&&
			App.defined(params.viewName)	&&
			App.defined(App.Views[params.viewName])
		){
			Backbone.history.navigate(route);
			this.showOrGoTo(params, comparator);
		} else {
			return;
		}
	},

	showOrGoToOld: function(viewName, params){
		var rendered, viewRef, portletFrameClass;
		params = (params) ? params : {};
		if(!App.defined(App.Views[viewName])){return;}
		if (viewName.indexOf('Show') === -1){
			_.each(app.children, function(view){
				if (view instanceof(App.Views.PortletView) && 
						App.defined(view.viewName) && 
						view.viewName === viewName
				){
					rendered = true;
					viewRef  = view; 
				}
			});
		} else {
			if(!App.defined(params.viewModelId)){return;}
			_.each(app.children, function(pView){
				if (pView instanceof(App.Views.PortletView) &&
						App.defined(pView.view) &&
						App.defined(pView.view.model) &&
						pView.view.model.id === params.viewModelId
				){
					rendered = true;
					viewRef  = pView; 
				}
			});
			portletFrameClass = 'green';
		}
		if(rendered){
			App.scrollTo(viewRef.el);
		} else {
			params.portletFrameClass = portletFrameClass;
			params.viewName          = viewName;
			this.show(params);
		}
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
			view.view.model.id === this.viewModelId
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
		params     = (params) ? params : {};
		comparator = (comparator) ? comparator : this.defaultComparator;
		viewRef    = this.viewIsRendered(comparator, params);
		if (viewRef){
			App.scrollTo(viewRef.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		var options = (params) ? params : {};
		if (!options.portletFrameClass){
			delete options.portletFrameClass;
		}
		if(!options.viewName){return new Error('The viewName option must be set');}
		var view = new App.Views.PortletView(options);
		this.appendToContent(view);
		App.scrollTo(view.el);
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