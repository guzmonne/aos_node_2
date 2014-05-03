App.GiraffeApp = Giraffe.App.extend({
	attributes: function(){
		return {
			'id': 'content-el',
		};
	},

	getAppStorage: function(collectionName){
		if(!App.defined(app[collectionName])){
			this[collectionName] = new App.Collections[collectionName]();
		}
		return this[collectionName];
	},

	pushToStorage: function(collectionName, object){
		var collection, model, id;
		collection = this.getAppStorage(collectionName);
		if (object instanceof collection.model){
			model = object;
		} else {
			if (object._id){
				model = collection.at(object._id);
			}
			if (model){
				model.set(object);
			} else {
				model = new collection.model(object);
			}
		}
		collection.add(model);
		return model;
	},
});

var app = new App.GiraffeApp();

// Configure Ajax to use CSRF
app.addInitializer(function(){
	$.ajaxSetup({
    headers: {
      'X-CSRF-Token': csrf
    }
  });
});

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Build SideNav
app.addInitializer(function(options){
	app.sideNav = new App.Views.SideNavView();
	app.sideNav.attachTo('#sidebar-el');
});

// Build Modal Controller View
app.addInitializer(function(){
	app.modalController = new App.Views.ModalController();
	app.modalController.attachTo('#wrapper');
});

// Build Scroller
app.addInitializer(function(options){
	app.GoToTopView = new App.Views.GoToTopView();
	app.GoToTopView.attachTo('#scroller-el');
});

// Start Backbone History, Renderer and main router
app.addInitializer(function(){
	app.Renderer   = new App.Views.Renderer();
	app.MainRouter = new App.Routers.MainRouter();
	Backbone.history.start();
});

$(document).ready(function(){
	app.attachTo('section#page-wrapper');
	app.start();
});