// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Regions    : {},

	vent: _.extend({}, Backbone.Events),

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	sseInit: function(){
		if (!!window.EventSource){
			this.vent.source = new EventSource();
			this.vent.source.addEventListener('sse::connection', function(e){
				console.log(e);
			});
			this.vent.onmessage = function(event){
				data = JSON.parse(event.data);
				event = data.event;
				delete data.event;
				this.vent.trigger(event, data);
			};
			this.vent.onerror = function(event){
				if (event.target.readyState === EventSource.CLOSED){
					console.log("Connection failed. Will not retry.");
				}
			};
		} else {
			console.log("EventSource is not supported");
		}
	},
};
App.Views.NewClientView = Giraffe.View.extend({
	template            : HBS.new_client_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,
	className: "row",

	events: {
		'click #add-phone-number'      : 'addPhoneNumber',
		'click button.del-phone-number': 'delPhoneNumber',
		'click #add-address'           : 'addAddress',
		'click button.del-address'     : 'delAddress',
	},

	addPhoneNumber: function (e) {
		var phoneNumber = $('[name=phone]');
		var timestamp   = new Date().getTime();
		if (phoneNumber.val() === ""){return;}
		$('#phone-numbers').append(
			this.phoneFieldTemplate({
				phoneNumber: phoneNumber.val(),
				timestamp  : timestamp
			})
		);
		this.pluralize($('[data-phone-id]').length, '[for="phone"]', 'Telefono', 'Telefonos');
		phoneNumber.focus();
		phoneNumber.val('');
	},


	addAddress: function(e){
		var street     = $('[name=street]');
		var city       = $('[name=city]');
		var department = $('[name=department]');
		var timestamp  = new Date().getTime();
		if(street.val() === ""){return;}
		$('#addresses').append(
			this.addressFieldTemplate({
				street    : street.val(),
				city      : city.val(),
				department: department.val(),
				timestamp : timestamp
			})
		);
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
		street.focus();
		street.val('');
		city.val('');
		department.val('');
	},

	delPhoneNumber: function(e){
		var id = $(e.currentTarget).closest('button').data('phoneId');
		$('#' + id).parent().remove();
		$('[data-phone-id=' + id + ']').parent().remove();
		this.pluralizePhones();
	},

	delAddress: function(e){
		var id = $(e.currentTarget).closest('button').data('addressId');
		console.log(e, id);
		$('[data-address-id='+id+']').remove();
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
	},

	pluralizePhones: function(){
		if ($('[data-phone-id]').length > 0){
			$('[for="phone"]').text('Telefonos');
		} else {
			$('[for="phone"]').text('Telefono');
		}
	},

	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 0){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

});
App.Views.BreadCrumbsView = Giraffe.View.extend({
	template: HBS.breadcrumbs_template,
	className: 'row',
});
App.Views.AlertsLayoutView = Giraffe.View.extend({
	template: HBS.alerts_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.MessagesLayoutView = Giraffe.View.extend({
	template: HBS.messages_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.NavView = Giraffe.View.extend({
	template: HBS.nav_template,
	tagName: 'nav',
	attributes: function(){
		return {
			'class': "navbar navbar-inverse navbar-static-top",
			'role': "navigation", 
			'style': "margin-bottom: 0" 
		};
	},

	initialize: function(){
		this.toggleSidebar = _.throttle(this.toggleSidebar, 600);
	},

	events: {
		'click #toggle-sidebar': 'toggleSidebar',
		'click .navbar-brand': 'toggleSidebar'
	},

	afterRender: function(){
		this.messagesLayout = new App.Views.MessagesLayoutView();
		this.tasksLayout    = new App.Views.TasksLayoutView();
		this.alertsLayout = new App.Views.AlertsLayoutView();
		this.userSettingsView = new App.Views.UserSettingsView();
		this.messagesLayout.attachTo('#nav-monitor-el');
		this.tasksLayout.attachTo('#nav-monitor-el');
		this.alertsLayout.attachTo('#nav-monitor-el');
		this.userSettingsView.attachTo('#nav-monitor-el');
	},

	toggleSidebar: function(e){
		e.preventDefault();
		var wrapper = $('#page-wrapper');
		var sidebar = $('#sidebar-el');
		sidebar.off(App.animationEnd);
		if(wrapper.css('margin') === "0px"){
			wrapper.addClass('make-space-right');
			sidebar.show();
			sidebar.addClass('animated slideInLeft')
				.on(App.animationEnd, function(){
					sidebar.removeClass('animated slideInLeft');
				});
		} else {
			wrapper.removeClass('make-space-right');
			sidebar.addClass('animated slideOutLeft')
				.on(App.animationEnd, function(){
					sidebar.hide();
					sidebar.removeClass('animated slideOutLeft');
				});
		}
	},
});
App.Views.TasksLayoutView = Giraffe.View.extend({
	template: HBS.tasks_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.UserSettingsView = Giraffe.View.extend({
	template: HBS.user_settings_template,
	tagName: 'li', 
	className: 'dropdown',
});
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