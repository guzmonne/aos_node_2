// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Regions    : {},

	vent: _.extend({}, Backbone.Events),

	defined: function(object){
		if (typeof object !== "undefined" && object !== null) {
			return true;
		} else {
			return false;
		}
	},

	animate: function(el, animation, callback){
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback();}
		}, 800);
	},

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	scrollTo: function(position){
		var pos;
		if (_.isNumber(position)){
			pos = position;
		} else {
			pos = this.elPosition(position);
		}
		$('html, body').animate({
			scrollTop: pos
		}, 500);
	},

	elPosition: function(el){
		return $(el).offset().top;
	},

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
App.Models.BaseModel = Giraffe.Model.extend({
	dateDDMMYYYY: function(date){
		return date.getDate() +
			"/" + date.getMonth() + 
			"/" + date.getFullYear();
	},
});
App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',

	defaults: function(){
		return {
			'id'        : null,
			'name'      : '',
			'email'     : '',
			'doc-type'  : '',
			'doc-number': '',
			'phones'    : new App.Collections.Phones(),
			'addresses' : new App.Collections.Addresses(),
			'createdAt' : new Date(),
			'updatedAt' : new Date(),
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},

	initialize: function(attributes, options){
		if (attributes !== undefined && attributes !== null){
			this.parseAttributes(attributes);
		}
	},

	parseAttributes: function(attributes){
		if(App.defined(attributes.phones)){
			if(_.isArray(attributes.phones)){
				this.set('phones', new App.Collections.Phones(attributes.phones));
			}
		}
		if(App.defined(attributes.addresses)){
			if(_.isArray(attributes.addresses)){
				this.set('addresses', new App.Collections.Addresses(attributes.addresses));
			}
		}
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(attributes.phones instanceof(Giraffe.Collection)){
			attributes.phones = attributes.phones.toJSON();
		}
		if(attributes.addresses instanceof(Giraffe.Collection)){
			attributes.addresses = attributes.addresses.toJSON();
		}
		return attributes;
	},
});

App.Models.Phone = App.Models.BaseModel.extend({
	defaults: function(){
		return {
			number: '',
		};
	},
});

App.Models.Address = App.Models.BaseModel.extend({
	defaults: function(){
		return {
			street    : '',
			city      : '',
			department: '',
		};
	},
});
App.Collections.Clients = Giraffe.Collection.extend({
	url  : '/api/clients',
	model: App.Models.Client,
});

App.Collections.Phones = Giraffe.Collection.extend({
	model: App.Models.Phone,
});

App.Collections.Addresses = Giraffe.Collection.extend({
	model: App.Models.Address,
});
App.Views.BaseView = Giraffe.View.extend({
	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 1){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

	closeView: function(e){
		if(App.defined(e)){
			e.preventDefault();
		}
		var self = this;
		App.animate(this.$el, 'fadeOut', function(){
			self.dispose();
		});
	},

	serialize: function(){
		if (App.defined(this.model)){
			return this.model.toJSON();
		}
	},

	capitaliseFirstLetter: function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	displayPortletMessage: function(options){
		var defaultOptions = {
			viewCid: this.parent.cid,
			title  : 'Titulo:',
			message: 'Cuerpo del mensaje',
		};
		var opts = typeof options !== 'undefined' ? options : defaultOptions; 
		app.trigger('portlet:message', opts);
	},
});
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
App.Views.ClientRowView = App.Views.BaseView.extend({
	template : HBS.client_row_template,

	tagName  : 'tr',

	activated  : false,

	ui: {
		$showClient: '#show-client',
	},

	appEvents: {
		'client:show:close' : 'deactivate',
		'client:show:active': 'activateRenderedViews', 
	},

	events: {
		'click #show-client': 'showClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
	},

	afterRender: function(){
		if(this.activated){
			this.activate();
		}
	},

	serialize: function(){
		return this.model.serialize();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.activated = true;
		this.$el.addClass('selected');
	},

	activateRenderedViews: function(cid){
		if(this.model.cid === cid){
			this.activate();
		}
	},

	deactivate: function(cid){
		if(cid === this.model.cid && this.$el.hasClass('selected')){
			this.activated = false;
			this.$('#show-client>i').removeClass('fa-spin');
			this.$el.removeClass('selected');
			this.className = '';
		}
	},

	showClient: function(){
		var exists = false;
		var self   = this;
		var view;
		_.each(app.children, function(portletView){
			if (App.defined(portletView.view) && 
					App.defined(portletView.view.model) && 
					portletView.view.model.cid === self.model.cid
			){
				exists = true;
				view   = portletView;
			}
		});
		if (exists === false) {
			var clientShowView = new App.Views.PortletView({
				viewName         : 'ClientShowView', 
				viewModel        : this.model,
				portletFrameClass: 'green',
				entrance         : 'fadeInUp',
			});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.ClientIndexView.el, method: 'before'});
			this.activate();
		} else {
			console.log(view);
			App.scrollTo(view.el);
		}
	},
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-lg-12',

	events: {
		'click #add-phone-number'        : 'reRender',
		'click button.del-phone-number'  : 'delPhoneNumber',
		'click button.edit-phone-number' : 'editPhoneNumber',
		'click #add-address'             : 'reRender',
		'click button.del-address'       : 'delAddress',
		'click button.edit-address'      : 'editAddress',
		'click #reset-form'              : 'render',
		'click #update-form'             : 'updateForm',
		'submit form'                    : 'submitForm',
	},

	serialize: function(){
		this.model.set('phonesLength', this.model.get('phones').length);
		this.model.set('addressesLength', this.model.get('addresses').length);
		return this.model.serialize();
	},

	addPhoneToCollection: function(){
		var number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.get('phones').add({number: number});
	},

	delPhoneNumber:function(e){
		var index  = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		var phones = this.model.get('phones');
		var model  = phones.models[index];
		phones.remove(model);
		this.reRender('[name=phone]');
	},

	editPhoneNumber: function(e){
		var index  = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		var phones = this.model.get('phones');
		var model  = phones.models[index];
		phones.remove(model);
		this.reRender("[name=phone]");
		this.$('[name=phone]').val(model.get('number'));
	},

	addAddressToCollection: function(){
		var street     = this.$('[name=street]').val();
		var city       = this.$('[name=city]').val();
		var department = this.$('[name=department]').val();
		if(street === ""){return;}
		var attrs = {
			street    : street,
			city      : city,
			department: department,
		};
		this.model.get('addresses').add(attrs);
	},

	delAddress: function(e){
		var index     = parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex'));
		var addresses = this.model.get('addresses');
		var model     = addresses.models[index];
		addresses.remove(model);
		this.reRender('[name=street]');
	},

	editAddress: function(e){
		var index     = parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex'));
		var addresses = this.model.get('addresses');
		var model     = addresses.models[index];
		console.log(model);
		addresses.remove(model);
		this.reRender('[name=street]');
		this.$('[name=street]').val(model.get('street'));
		this.$('[name=city]').val(model.get('city'));
		this.$('[name=department]').val(model.get('department'));
	},

	setModel: function(){
		this.model.set('name', this.$('[name=name]').val());
		this.model.set('doc-type', this.$('[name=doc-type]').val());
		this.model.set('doc-number', this.$('[name=doc-number]').val());
		this.model.set('email', this.$('[name=email]').val());
		var phone  = this.$('[name=phone]').val();
		var street = this.$('[name=street]').val();
		if (phone !== ''){
			this.addPhoneToCollection();
		}
		if (street !== ''){
			this.addAddressToCollection();
		}
	},

	submitForm: function(e){
		e.preventDefault();
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.model.save();
		if (App.defined(app.ClientIndexView)){
			this.app.ClientIndexView.view.collection.add(this.model);
		}
		this.model = new App.Models.Client();
		this.displayPortletMessage({
			viewCid: this.parent.cid,
			title  : 'Cliente Creado',
			message: 'El nuevo cliente se ha creado con exito.',
			class  : 'success',
		});
		this.render();
		this.$('[name=name]').focus();
	},

	updateForm: function(e){
		e.preventDefault();
		this.setModel();
		this.model.trigger('updated');
	},

	reRender: function(elToFocus){
		this.setModel();
		this.render();
		if (
			_.isObject(elToFocus) && 
			elToFocus.currentTarget !== undefined &&
			elToFocus.currentTarget.dataset !== undefined &&
			elToFocus.currentTarget.dataset.for !== undefined
		){
			this.$('[name='+ elToFocus.currentTarget.dataset.for +']').focus();
		} else {
			this.$(elToFocus).focus();
		}
	},
});
App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "Clientes",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "table-responisve",

	oTable: null,

	initialize: function(){
		if (this.collection === undefined || this.collection === null || this.collection.length === 0){
			this.collection = clients;
			this.render();
		}
	},

	afterRender: function(){
		if (this.oTable === null){
			this.oTable = this.$('#clients-table').dataTable();
		}
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
		app.trigger('client:index:render');
	},

	attach: function(view, options){
		this.addChild(view);
		this.oTable.fnAddTr(view.render().el);
	},
});
App.Views.ClientNewView = App.Views.BaseView.extend({	
	name: "Nuevo Cliente",

	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: new App.Models.Client()});
		this.clientForm.attachTo(this.$el, {method: 'html'});
	},
});
App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	name    : null,

	appEvents: {
		"client:index:render": 'announce',
	},

	initialize: function(){
		this.name = 'Cliente: ' + this.model.get('name') + ' #' + this.model.id;
		this.listenTo(this.model, 'updated', this.update);
	},

	afterRender: function(){
		App.scrollTo(this.parent.el);
		this.announce();
		this.renderForm();
	},

	update: function(){
		this.parent.flash = {
			title  : 'Cliente Actualizado',
			message: 'El cliente se ha actualizado con exito.',
			class  : 'success',
		};
		this.parent.render();
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt));
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt));
		return this.model.serialize();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: this.model});
		this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
	},

	announce: function(){
		app.trigger('client:show:active', this.model.cid);
	},

	beforeDispose: function(){
		app.trigger('client:show:close', this.model.cid);
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
App.Views.BSCalloutView = App.Views.BaseView.extend({
	template: HBS.bs_callout_template,

	className: "bs-callout",

	lifetime: 3000,

	events: {
		'click .close': 'closeView',
	},

	afterRender: function(){
		var self = this;
		var className = this.model.get('class');
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(this.lifetime > 0){
			this.timer = setTimeout(function(){
				self.closeView();
			}, this.lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},
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
		this.messagesLayout   = new App.Views.MessagesLayoutView();
		this.tasksLayout      = new App.Views.TasksLayoutView();
		this.alertsLayout     = new App.Views.AlertsLayoutView();
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
		wrapper.toggleClass('make-space-right');
		app.trigger('nav:toggleMenu');
	},
});
App.Views.PortletView = App.Views.BaseView.extend({
	template: HBS.portlet_template,

	className: "row",

	view             : null,
	viewName         : null,
	viewModel        : null,
	portletFrameClass: null,
	flash            : null,
	entrance         : 'fadeInLeft',

	appEvents: {
		'portlet:message': 'message',
	},

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(options){
		this.model = new Backbone.Model();
		this.model.set('cid', this.cid);
	},

	afterRender: function(options){
		this.setFrame();
		this.setMainChildView();
		this.startTools();
		this.displayFlash();
	},

	displayFlash: function(){
		if (App.defined(this.flash)){
			this.showMessage(this.flash);
			console.log(this.flash);
			this.flash = null;
		}
	},

	startTools: function(){
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setMainChildView: function(){
		if(App.defined(this.viewName)){
			if(this.viewModel !== null){
				this.view = new App.Views[this.viewName]({model: this.viewModel});
			} else {
				this.view = new App.Views[this.viewName]();
			}
			this.setHeader();
			this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
		}
	},

	setHeader: function(header){
		if (App.defined(this.view.name)){
			this.$('#portlet-title-header').text(this.view.name);
		}
	},

	setFrame: function(){
		if(App.defined(this.portletFrameClass)){
			this.$('#portlet-frame').addClass('portlet-' + this.portletFrameClass);
		}
	},

	message: function(data){
		if (!App.defined(data) && !App.defined(data.viewCid)){
			return;
		}
		if (this.view.cid === data.viewCid){
			delete data.viewCid;
			this.showMessage(data);
		}
	},

	showMessage: function(data){
		var options = {};
		if(App.defined(data.lifetime)){
			options.lifetime = data.lifetime;
			delete data.lifetime;
		}
		options.model = new Backbone.Model(data);
		var callout = new App.Views.BSCalloutView(options);
		this.attach(callout, {el: this.$('#portlet-messages'), method: 'prepend'});
	},
});
App.Views.SearchView = App.Views.BaseView.extend({
	template: HBS.search_template,
	className: "input-group custom-search-form",
});
App.Views.SideNavView = App.Views.BaseView.extend({
	template: HBS.side_nav_template,

	show: true,

	tagName: 'nav',
	attributes: function(){
		return {
			'class': 'navbar-inverse navbar-static-side animated fadeInLeft',
			'role' : 'navigation',
		};
	},

	appEvents: {
		'nav:toggleMenu': 'toggleMenu',
	},

	events: {
		'click ul#side-menu li a'       : 'activateLi',
		'click ul.nav-second-level li a': 'activateSecondLi',
	},

	afterRender: function(){
    this.$('#side-menu').metisMenu();
    this.searchView = new App.Views.SearchView();
    this.searchView.attachTo('ul#side-menu li.sidebar-search');
	},

	activateLi: function(e){
		this.$('ul#side-menu li a').removeClass('active');
		this.$(e.currentTarget).closest('a').addClass('active');
	},

	activateSecondLi: function(e){
		this.$('ul.nav-second-level li a').removeClass('second-level-active');
		this.$(e.currentTarget).closest('a').addClass('second-level-active');
	},

	toggleMenu: function(){
		if(this.show){
			this.show = false;
			this.$el.removeClass('slideInLeft').addClass('slideOutLeft');
		} else {
			this.show = true;
			this.$el.removeClass('slideOutLeft').addClass('slideInLeft');
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
App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/:type': 'render:route',
		':doc/:type'       : 'render:route',
	},
});
App.Views.GoToTopView = App.Views.BaseView.extend({
	template: HBS.go_to_top_template,

	winH: 0,
	winW: 0,
	win: null,

	events: {
		'click': function(e){e.preventDefault(); App.scrollTo(0);},
	},

	initialize: function(){
		var self = this;
		this.win = $(window);
		this.win.scroll(function(){
			self.toggleViewOnOverflow();
		});
		//this.toggleViewOnOverflow = _.throttle(this.toggleViewOnOverflow, 10 * 1000);
	},

	afterRender: function(){
		this.toggleViewOnOverflow();
		this.$el.tooltip();
	},

	windowHeight: function(){
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			this.winW = window.innerWidth;
			this.winH = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			this.winW = document.documentElement.clientWidth;
			this.winH = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			this.winW = document.body.clientWidth;
			this.winH = document.body.clientHeight;
		}
	},

	toggleViewOnOverflow: function(){
		if(this.win.scrollTop() > 300){
			this.$el.fadeIn();
		} else {
			this.$el.fadeOut();
		}
	},
});
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

app.template = HBS.app_template;

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