App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:route': 'openView',
	},

	openView: function(doc, type){
		var docName  = this.capitaliseFirstLetter(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		if(App.defined(App.Views[viewName])){
			Backbone.history.navigate(doc + '/' + type);
			this.showOrGoTo(viewName);
		} else {
			return;
		}
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