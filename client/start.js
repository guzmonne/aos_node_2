var clientFixtures = 
	[
		{
			'id'        : 1,
			'name'      : 'Guzmán Monné',
			'doc-type'  : 'CI',
			'doc-number': '41234567',
			'phones'    :
			[
				{
					'number': '099123456'
				},
				{
					'number': '094789456'
				},
			],
			'addresses':
			[
				{
					'street'    : 'Av. Italia 7274',
					'city'      : 'Carrasco',
					'department': 'Montevideo'
				},
				{
					'street'    : '8 de Octubre 2012',
					'city'      : 'Tres Cruces',
					'department': 'Montevideo'
				},
			],
			'email': 'guz@example.com'
		},
		{
			'id': 2,
			'name': 'Juan Perez',
			'doc-type'  : 'CI',
			'doc-number': '478963214',
			'phones':
			[
				{
					'number': '099987654'
				},
			],
			'addresses':
			[
				{
					'street'    : 'Av. 18 de Julio 7274',
					'city'      : 'Centro',
					'department': 'Montevideo'
				},
			],
			'email': 'jperez@example.com'
		},
		{
			'id': 3,
			'name': 'Pedro Picapiedra',
			'doc-type'  : 'CI',
			'doc-number': '65478912342',
			'phones':
			[
				{
					'number': '099000000'
				},
				{
					'number': '091000000'
				},
			],
			'addresses':
			[
				{
					'street'    : 'Piedra Floja 123',
					'city'      : 'Piedra Lisa',
					'department': 'Pedragoza'
				},
				{
					'street'    : 'Piedra Dura',
					'city'      : 'Piedra Lisa',
					'department': 'Pedragoza'
				},
			],
			'email': 'guz@example.com'
		},
	];

var app     = new Giraffe.App();
var clients = new App.Collections.Clients(clientFixtures);

app.template  = HBS.app_template;
app.className = "row";

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

// Main Content
app.addInitializer(function(options){
	app.GoToTopView = new App.Views.GoToTopView();
	app.GoToTopView.attachTo('#content-el');
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