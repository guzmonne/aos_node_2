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