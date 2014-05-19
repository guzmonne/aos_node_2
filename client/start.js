App.GiraffeApp = Giraffe.App.extend({
	attributes: function(){
		return {
			'id': 'content-el',
		};
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

// Setup Notify.js
app.addInitializer(function(options){
	$.notify.defaults({
		globalPosition: 'top right',
		showAnimation: 'fadeIn',
		hideAnimation: 'fadeOut',
		autoHideDelay: 1500,
		showDuration: 200,
	});
	$.notify.addStyle('bs-callout', {
	html: 
		"<div>" +
			"<div class='clearfix'>" +
				"<h4 class='title' data-notify-text='title'></h4>" +
				"<p class='message' data-notify-text='message'></p>" +
			"</div>" +
		"</div>"
	});
});

// Add an easy access for the storage on the app object and populate some
// basic collections.
app.addInitializer(function(){
	app.storage = App.Storage.getInstance();
	app.storage.collection("models").add(models);
	app.storage.collection("clients").add(clients);
	app.storage.collection("users").add(techs);
	clients = undefined;
	models  = undefined;
	techs   = undefined;
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