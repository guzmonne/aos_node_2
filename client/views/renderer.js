App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.getDocName(doc);
		var viewName = docName + 'ShowView';
		var params   = {
			viewModelId: id
		};
		this.checkViewName(viewName, doc + '/show/' + id, params);
	},

	docView: function(doc, type){
		var docName  = this.getDocName(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		this.checkViewName(viewName, doc + '/' + type);
	},

	getParamsArray: function(params){
		var paramsArray = {};
		var pairs       = params.split('?');
		for(var i = 0; i < pairs.length; i++){
			var pair = pairs[i].split('=');
			paramsArray[pair[0]] = pair[1];
		}
		return paramsArray;
	},

	checkViewName: function(viewName, route, params){
		if(App.defined(App.Views[viewName])){
			Backbone.history.navigate(route);
			this.showOrGoTo(viewName, params);
		} else {
			return;
		}
	},

	getDocName: function(doc){
		var docName = '';
		if (doc.indexOf('_') !== -1){
			docName = this.capitaliseFirstLetter(doc);
		} else {
			var nameArray = doc.split('_');
			for(var i = 0; i < nameArray.length; i++){
				docName = docName + this.capitaliseFirstLetter(nameArray[i]); 
			}
		}
		return docName;
	},

	showOrGoTo: function(viewName, params){
		var rendered, viewRef, portletFrameClass;
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
			var options = (params) ? params : {};
			if (portletFrameClass){
				options.portletFrameClass = portletFrameClass;
			}
			options.viewName = viewName;
			app[viewName] = new App.Views.PortletView(options);
			app[viewName].attachTo('#content-el', {method: 'prepend'});
			App.scrollTo(app[viewName].el);
		}
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
});