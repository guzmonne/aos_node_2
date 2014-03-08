app = new Giraffe.App();

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Main Content
app.addInitializer(function(options){
	app.breadCrumbs = new App.Views.BreadCrumbsView();
	app.newClient = new App.Views.NewClientView();
	app.breadCrumbs.attachTo('#content-el');
	app.newClient.attachTo('#content-el');
});

// Start Backbone History
app.addInitializer(function(){
	Backbone.history.start();
	console.log("Backbone Giraffe App is up and running");
});

$(document).ready(function(){
	app.start();
});