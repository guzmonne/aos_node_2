App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'route:doc:index': 'openIndexView',
		'route:doc:new'  : 'openNewView',
	},

	openIndexView: function(doc){
		var viewName = this.capitaliseFirstLetter(doc) + 'IndexView';
		this.showOrGoTo(viewName);
	},

	openNewView: function(doc){
		var viewName = this.capitaliseFirstLetter(doc) + 'NewView';
		this.showOrGoTo(viewName);
	},

	showOrGoTo: function(viewName){
		var rendered, viewRef;
		if(!App.defined(App.Views[viewName])){return;}
		_.each(app.children, function(view){
			if (view instanceof(App.Views.PortletView) && 
					App.defined(view.viewName) && 
					view.viewName === viewName){
				rendered = true;
				viewRef  = view; 
			}
		});
		if(rendered){
			App.scrollTo(viewRef.el);
		} else {
			app[viewName] = new App.Views.PortletView({viewName: viewName});
			app[viewName].attachTo('#content-el', {method: 'prepend'});
			App.scrollTo(app[viewName].el);
		}
	},
});