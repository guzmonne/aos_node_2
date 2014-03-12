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

	push: function(attr, value){
		if (_.isArray(this.attributes[attr])){
			this.attributes[attr].push(value);
		} else {
			this.set(attr, value);
		}
	},

	pop: function(attr, index){
		var array = this.get(attr);
		if(_.isString(index)){
			index = parseInt(index);
		}
		if(_.isArray(array)){
			return array.splice(index, 1);
		} else {
			throw new Error( attr  + 'is not an array');
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
			'id'  : null,
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
		'click #reset-form'            : 'render',
		'click #update-form'           : 'updateForm',
		'change input'                 : 'changeFormInput',
		'change select'                : 'changeFormInput',
		'submit form'                  : 'submitForm',
	},

	afterRender: function(){
		this.$('[name=name]').focus();
	},

	changeFormInput: function(e){
		var value = e.target.value;
		var name = e.target.name;
		if(name.indexOf(".") != -1){
			this.model.setn(name, value);
		} else {
			this.model.set(name, value);
		}
	},

	serialize: function(){
		this.model.set('phones-length', this.model.get('phones').length);
		this.model.set('addresses-length', this.model.get('addresses').length);
		return this.model.toJSON();
	},

	addPhoneNumber: function(){
		this.setPhoneNumberInModel();
		this.reRender('[name=phone]');
	},

	setPhoneNumberInModel: function(){
		var number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.push('phones', {
			number: number,
		});
	},

	delPhoneNumber:function(e){
		var index = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		this.model.pop('phones', index);
		this.reRender('[name=phone]');
	},

	addAddress: function(){
		this.setAddressInModel();
		this.reRender('[name=street]');
	},

	setAddressInModel: function(){
		var street     = this.$('[name=street]').val();
		var city       = this.$('[name=city]').val();
		var department = this.$('[name=department]').val();
		if(street === ""){return;}
		var attrs = {
			street    : street,
			city      : city,
			department: department,
		};
		this.model.push('addresses', attrs);
	},

	delAddress: function(e){
		var index = parseInt(this.$(e.currentTarget).closest('button').data('addressIndex'));
		this.model.pop('addresses', index);
		this.reRender('[name=street]');
	},

	setModel: function(){
		this.model.set('name', this.$('[name=name]').val());
		this.model.setn('doc.type', this.$('[name=doc-type]').val());
		this.model.setn('doc.number', this.$('[name=doc-number]').val());
		this.model.set('email', this.$('[name=email]').val());
		var phone  = this.$('[name=phone]').val();
		var street = this.$('[name=street]').val();
		if (phone !== ''){
			this.addPhoneNumber();
		}
		if (street !== ''){
			this.addAddress();
		}
	},

	submitForm: function(e){
		e.preventDefault();
		if(this.$('button[type=submit]').length === 0){return;}
		this.setAddressInModel();
		this.setPhoneNumberInModel();
		this.app.clientIndex.collection.add(this.model);
		this.model = new App.Models.Client();
		this.render();
	},

	updateForm: function(e){
		e.preventDefault();
		this.setAddressInModel();
		this.setPhoneNumberInModel();
		this.model.trigger('updated');
	},

	reRender: function(activeAttr){
		this.render();
		this.$(activeAttr).focus();
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
			'id': 1,
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
			'id': 2,
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
			'id': 3,
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