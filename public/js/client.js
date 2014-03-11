// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Regions    : {},

	vent: _.extend({}, Backbone.Events),

	animate: function(el, animation, callback){
		console.log($(el));
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback();}
		}, 800);
	},

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	scrollTo: function(position){
		$('html, body').animate({
			scrollTop: position
		}, 500);
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
	getn: function(nestedAttrs){
		var attrs = nestedAttrs.split('.');
		var aux   = this.get(attrs[0]);
		_.each(attrs, function(attr, i){
			if (i !== 0){	
				aux = aux[attr];
			}
		});
		return aux;
	},

	setn: function(nestedAttrs, value){
		var self  = this;
		var attrs = nestedAttrs.split('.');
		var aux   = this.get(attrs[0]);
		_.each(attrs, function(attr, i){
			if (i === (attrs.length - 1)){
				aux[attr] = value;
				self.trigger('change:' + nestedAttrs);
			} else if (i !== 0){
				aux = aux[attr];
			}
		});
		return aux;
	},

	setp: function(attr, value){
		if (_.isArray(this.attributes[attr])){
			this.attributes[attr].push(value);
		} else {
			this.set(attr, value);
		}
	},

	popByEl: function(id, el, array){
		var self = this;
		_.each(array, function(element){
			if (element[el] === id){
				var index = array.indexOf(element);
				array.splice(index, 1);
			}
		});
	},

	dateDDMMYYYY: function(date){
		return date.getDate() +
			"/" + date.getMonth() + 
			"/" + date.getFullYear();
	},
});
App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: function(){
		return {
			'id'  : this.cid,
			'name': '',
			'doc' : {
				'type'  : '',
				'number': ''
			},
			'phones'   : [],
			'addresses': [],
			'email'    : '',
			'createdAt': new Date(),
			'updatedAt': new Date(),
			'createdBy': 'Guzmán Monné',
			'updatedBy': 'Guzmán Monné'
		};
	},
});
App.Collections.Clients = Giraffe.Collection.extend({
	model: App.Models.Client,

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
});
App.Views.ClientRowView = App.Views.BaseView.extend({
	template : HBS.client_row_template,

	tagName  : 'tr',

	ui: {
		$showClient: '#show-client',
	},

	appEvents: {
		'client:show:close': 'deactivate',
	},

	events: {
		'click #show-client': 'showClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
	},

	serialize: function(){
		return this.model.toJSON();
	},

	onDelete: function(){
		this.model.dispose();
	},

	activate: function(e){
		this.$el.addClass('selected');
		this.app.trigger('client_row:selected', this.cid);
	},

	deactivate: function(cid){
		if(cid === this.model.cid && this.$el.hasClass('selected')){
			this.$el.removeClass('selected');
		}
	},

	showClient: function(){
		var exists = false;
		var self   = this;
		var cid;
		_.each(app.children, function(view){
			if (view.model !== undefined && (view.model.cid === self.model.cid)){
				exists = true;
				cid    = view.cid;
			}
		});
		if (exists === false) {
			var clientShowView = new App.Views.ClientShowView({model: this.model});
			app.addChild(clientShowView);
			app.attach(clientShowView, {el: app.clientIndex.el, method: 'before'});
			this.activate();
		} else {
			App.scrollTo($('[data-view-cid='+cid+']').offset().top);
		}
	},
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-lg-12',

	events: {
		'click #add-phone-number'      : 'addPhoneNumber',
		'click button.del-phone-number': 'delPhoneNumber',
		'click #add-address'           : 'addAddress',
		'click button.del-address'     : 'delAddress',
		'click #reset-form'            : 'reset',
		'click #update-form'           : 'updateForm',
		'submit form'                  : 'submitForm',
	},

	serialize: function(){
		return this.model.toJSON();
	},

	addPhoneNumber: function () {
		var number = $('[name=phone]');
		var timestamp   = new Date().getTime();
		var attrs = {
			number: number.val(),
			timestamp  : timestamp
		};
		if (number.val() === ""){return;}
		$('#phone-numbers').append(this.phoneFieldTemplate(attrs));
		this.pluralize($('[data-phone-id]').length, '[for="phone"]', 'Telefono', 'Telefonos');
		this.model.setp('phones', attrs);
		number.focus();
		number.val('');
	},

	addAddress: function(){
		var street     = $('[name=street]');
		var city       = $('[name=city]');
		var department = $('[name=department]');
		var timestamp  = new Date().getTime();
		var attrs = {
			street    : street.val(),
			city      : city.val(),
			department: department.val(),
			timestamp : timestamp
		};
		if(street.val() === ""){return;}
		$('#addresses').append(this.addressFieldTemplate(attrs));
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
		this.model.setp('addresses', attrs);
		street.focus();
		street.val('');
		city.val('');
		department.val('');
	},

	delPhoneNumber: function(e){
		var self = this;
		var id   = $(e.currentTarget).closest('button').data('phoneId');
		$('#' + id).parent().remove();
		$('[data-phone-id=' + id + ']').parent().remove();
		this.model.popByEl(id, 'timestamp', this.model.attributes.phones);
		this.pluralize($('[data-phone-id]').length, '[for="phone"]', 'Telefono', 'Telefonos');
	},

	delAddress: function(e){
		var id   = $(e.currentTarget).closest('button').data('addressId');
		var self = this;
		$('[data-address-id='+id+']').remove();
		this.model.popByEl(id, 'timestamp', this.model.attributes.addresses);
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
	},

	setModel: function(){
		this.model.set('name', this.$('[name=name]').val());
		this.model.setn('doc.type', this.$('[name=doc-type]').val());
		this.model.setn('doc.number', this.$('[name=doc-number]').val());
		this.model.set('email', this.$('[name=email]').val());
		var phone  = $('[name=phone]').val();
		var street = $('[name=street]').val();
		if (phone !== ''){
			this.addPhoneNumber();
		}
		if (street !== ''){
			this.addAddress();
		}
	},

	submitForm: function(e){
		e.preventDefault();
		console.log('submitForm');
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.app.clientIndex.collection.add(this.model);
		this.reset();
	},

	updateForm: function(e){
		e.preventDefault();
		console.log('updateForm');
		this.setModel();
		this.model.trigger('updated');
	},

	reset: function(e){
		if (e !== null && e !== undefined){e.preventDefault();}
		this.parent.renderForm();
		this.$('[name=name]').focus();
	},
});
App.Views.ClientIndexView = Giraffe.Contrib.CollectionView.extend({
	name       : "App.Views.ClientIndexView",
	template   : HBS.client_index_template,
	modelView  : App.Views.ClientRowView,
	modelViewEl: '#clients',

	className: "row",

	afterRender: function(){
		this.oTable = this.$('#clients-table').dataTable();
		Giraffe.Contrib.CollectionView.prototype.afterRender.apply(this);
	},

	attach: function(view, options){
		this.app.clientIndex.oTable.fnAddTr(view.render().el);
	},
});
App.Views.ClientNewView = App.Views.BaseView.extend({
	template            : HBS.client_new_template,
	
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: new App.Models.Client()});
		this.clientForm.attachTo(this.$('#client-form'), {method: 'html'});
	},
});
App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	className: 'row',

	events: {
		'click #client-close' : 'closeView',
	},

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeIn');
		App.scrollTo($('[data-view-cid='+this.cid+']').offset().top);
		this.renderForm();
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt));
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt));
		return this.model.toJSON();
	},

	closeView: function(e){
		e.preventDefault();
		var self = this;
		App.animate(this.$el, 'fadeOut', function(){
			self.dispose();
			app.trigger('client:show:close', self.model.cid);
		});
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: this.model});
		this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
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
var clientFixtures = 
	[
		{
			'name': 'Guzmán Monné',
			'doc' : 
			{
				'type'  : 'CI',
				'number': '41234567',
			},
			'phones':
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
			'name': 'Juan Perez',
			'doc' : 
			{
				'type'  : 'CI',
				'number': '3456789',
			},
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
			'name': 'Pedro Picapiedra',
			'doc' : 
			{
				'type'  : 'Pasaporte',
				'number': '001',
			},
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

var app = new Giraffe.App();
var clients = new App.Collections.Clients(clientFixtures);

app.template = HBS.app_template;

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Main Content
app.addInitializer(function(options){
	app.breadCrumbs = new App.Views.BreadCrumbsView();
	app.clientNew   = new App.Views.ClientNewView();
	app.clientIndex = new App.Views.ClientIndexView({collection: clients});
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
	app.attachTo('section#page-wrapper');
	app.start();
});