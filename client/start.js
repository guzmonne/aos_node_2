app = new Giraffe.App();

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Main Content
app.addInitializer(function(options){
	app.breadCrumbs = new App.Views.BreadCrumbsView();
	app.clientNew   = new App.Views.ClientNewView();
	app.clientIndex = new App.Views.ClientIndexView();
	app.breadCrumbs.attachTo('#content-el');
	app.clientNew.attachTo('#content-el');
	app.clientIndex.attachTo('#content-el');
});

// Start Backbone History
app.addInitializer(function(){
	Backbone.history.start();
	console.log("Backbone Giraffe App is up and running");
});

$(document).ready(function(){
	app.start();
});