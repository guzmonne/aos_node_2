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
		var $viewport = $('html, body');
		if (_.isNumber(position)){
			pos = position;
		} else {
			pos = this.elPosition(position);
		}
		$viewport.animate({
			scrollTop: pos
		}, 500);
		$viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
			if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
				// This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
				$viewport.stop().unbind('scroll mousedown DOMMouseScroll mousewheel keyup'); 
			}
		});	
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
	idAttribute: '_id',
	
	dateDDMMYYYY: function(date){
		var parsedDate;
		if (date instanceof Date){
			parsedDate = date;
		} else {
			parsedDate = new Date(date);
		}
		return parsedDate.getDate() +
			"/" + parsedDate.getMonth() + 
			"/" + parsedDate.getFullYear();
	},
});
App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',

	defaults: function(){
		return {
			'model'             : null,
			'brand'             : null,
			'serial'            : null,
			'category'          : null,
			'subcategory'       : null,
			'accessories'       : [],
			'client_name'       : null,
			'client_id'         : null,
			'repairment_type'   : 'Garantía',
			'defect'            : null,
			'observations'      : null,
			'status'            : 'Abierto',
			'cost'              : 0,
			'solution'          : null,
			'diagnose'          : null,
			'replacements'      : null,
			'inStock'           : null,
			'departuredAt'      : null,
			'repairedAt'        : null,
			'technician_name'   : null,
			'technician_id'     : null,
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
			'service_request_id': null,
		};
	},
});
App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',

	defaults: function(){
		return {
			'name'      : '',
			'email'     : '',
			'doc-type'  : '',
			'doc-number': '',
			'phones'    : new App.Collections.Phones(),
			'addresses' : new App.Collections.Addresses(),
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
				this.set('phones', new App.Collections.Phones(attributes.phones), {silent: true});
				delete attributes.phones;
			}
		}
		if(App.defined(attributes.addresses)){
			if(_.isArray(attributes.addresses)){
				this.set('addresses', new App.Collections.Addresses(attributes.addresses), {silent: true});
				delete attributes.addresses;
			}
		}
		return attributes;
	},

	parse: function(response){
		if (this.id === undefined){
			return response;
		} else {
			return this.parseAttributes(response);
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
App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	initialize: function(attributes, options){
		if (App.defined(attributes)){
			this.parseAttributes(attributes);
		}
	},

	defaults: function(){
		return {
			'client_name'   : null,
			'client_id'     : null,
			'status'        : 'Pendiente',
			'createdAt'     : null,
			'updatedAt'     : null,
			'invoiceNumber' : null,
			'appliances'    : new App.Collections.Appliances(),
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
			'closedAt'			: null,
		};
	},

	parse: function(response){
		if (this.id){
			if (App.defined(response.appliances)){
				this.setAppliances(response.appliances);
			}
			return response; 
		} else {
			return response;
		}
	},

	parseAttributes: function(response){
		this.setAppliances(response.appliances);
		return response;
	},

	setAppliances: function(array){
		if(!App.defined(array)){
			array = this.get('appliances');
		}
		if (_.isArray(array)){
			this.set('appliances', new App.Collections.Appliances(array), {silent: true});
		}
		return this;
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(attributes.appliances instanceof(Giraffe.Collection)){
			attributes.appliances = attributes.appliances.toJSON();
		}
		return attributes;
	},
});
App.Collections.Appliances = Giraffe.Collection.extend({
	url: '/api/appliances',
	model: App.Models.Appliance,
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
App.Collections.ServiceRequests = Giraffe.Collection.extend({
	url  : function(){
		var u = '/api/service_requests';
		if (this.client_id){
			u = u + '/client/' + this.client_id;
		}
		return u;
	},

	model: App.Models.ServiceRequest,
});
App.Views.BaseView = Giraffe.View.extend({
	canSync: function(){
		if (App.defined(this.onSync)){
			this.onSync();
			return true;
		} else {
			return false;
		}
	},

	afterSync: function(){
		app.trigger('portlet:view: '+ this.cid +':sync:spin:stop');
	},

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
		this.dispose();
		//App.animate(this.$el, 'fadeOut', function(){
		//	self.dispose();
		//});
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
App.Views.TableView = App.Views.BaseView.extend({
	oTable     : null,
	
	firstRender: true,

	initialize: function(){
		var self = this;
		if(App.defined(this.beforeInitialize) && _.isFunction(this.beforeInitialize)){
			this.beforeInitialize();
		}
		if(!App.defined(this.tableCollection)){
			return new Error('Attribute tableCollection must be set.');
		}
		if(!App.defined(App.Collections[this.tableCollection])){
			return new Error('This tableCollection is not defined.');
		}
		if (!App.defined(this.collection)){
			if(App.defined(this.setCollection)){
				this.collection = this.setCollection();
			} else {
				this.collection = new App.Collections[this.tableCollection]();
			}
		}
		this.listenTo(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'sync', this.afterSync);
	},

	afterRender: function(){
		if(!App.defined(this.tableEl)){
			return new Error('Attribute tableEl must be set.');
		}
		this.oTable = this.$(this.tableEl).dataTable();	
		if (this.firstRender){
			if(this.collection.length > 0){
				this.appendCollection(this.collection);
			} else {
				this.collection.fetch();
			}
			this.firstRender = false;
		}
	},

	appendCollection: function(collection){
		var self = this;
		_.each(collection.models, function(model){
			self.append(model);
		});
	},	

	append: function(model){
		if (App.defined(this.modelView)){
			var view = new this.modelView({model: model});
			this.addChild(view);
			this.oTable.fnAddTr(view.render().el);
		}
	},
});
App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.getDocName(doc);
		var viewName = docName + 'ShowView';
		var params   = {
			viewModelId: id
		};
		this.checkViewName(viewName, doc + '/show/' + id, params);
	},

	docView: function(doc, type){
		var docName  = this.getDocName(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		this.checkViewName(viewName, doc + '/' + type);
	},

	getParamsArray: function(params){
		var paramsArray = {};
		var pairs       = params.split('?');
		for(var i = 0; i < pairs.length; i++){
			var pair = pairs[i].split('=');
			paramsArray[pair[0]] = pair[1];
		}
		return paramsArray;
	},

	checkViewName: function(viewName, route, params){
		if(App.defined(App.Views[viewName])){
			Backbone.history.navigate(route);
			this.showOrGoTo(viewName, params);
		} else {
			return;
		}
	},

	getDocName: function(doc){
		var docName = '';
		if (doc.indexOf('_') === -1){
			docName = this.capitaliseFirstLetter(doc);
		} else {
			var nameArray = doc.split('_');
			for(var i = 0; i < nameArray.length; i++){
				docName = docName + this.capitaliseFirstLetter(nameArray[i]); 
			}
		}
		return docName;
	},

	showOrGoTo: function(viewName, params){
		var rendered, viewRef, portletFrameClass;
		if(!App.defined(App.Views[viewName])){return;}
			if (viewName.indexOf('Show') === -1){
				_.each(app.children, function(view){
					if (view instanceof(App.Views.PortletView) && 
							App.defined(view.viewName) && 
							view.viewName === viewName
					){
						rendered = true;
						viewRef  = view; 
					}
				});
			} else {
				if(!App.defined(params.viewModelId)){return;}
				_.each(app.children, function(pView){
					if (pView instanceof(App.Views.PortletView) &&
							App.defined(pView.view) &&
							App.defined(pView.view.model) &&
							pView.view.model.id === params.viewModelId
					){
						rendered = true;
						viewRef  = pView; 
					}
				});
				portletFrameClass = 'green';
			}
		if(rendered){
			App.scrollTo(viewRef.el);
		} else {
			var options = (params) ? params : {};
			if (portletFrameClass){
				options.portletFrameClass = portletFrameClass;
			}
			options.viewName = viewName;
			app[viewName] = new App.Views.PortletView(options);
			app[viewName].attachTo('#content-el', {method: 'prepend'});
			App.scrollTo(app[viewName].el);
		}
	},

	viewIsRendered: function(comparator, context){
		var self = (context) ? context : this;
		var result = null;
		_.each(app.children, function(view){
			if(comparator.apply(self, [view])){
				result = view;
			}
		});
		return result;
	},

	appendToContent: function(view){
		app.attach(view, {el: '#content-el', method: 'prepend'});
	},
});
App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
	},

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.Appliance();
		}
		var col = this.model.collection;
		if (App.defined(col)){
			this.listenTo(col, 'appliance:deleted', this.saveAndDispose);
			this.listenTo(col, 'service_request:create:success', this.dispose);
		}
	},

	afterRender: function(){
		App.animate(this.$el, 'fadeInDown');
		this.$('[name=accessories]').tagsinput();
		if(this.firstRender){
			App.scrollTo(this.$el);
			this.firstRender = false;
		}
	},

	activateTags: function(){
		this.$('.bootstrap-tagsinput').addClass('active');
	},

	deactivateTags: function(){
		var input = this.$('.bootstrap-tagsinput input');
		var value = input.val();
		if (value !== ''){
			this.$('[name=accessories]').tagsinput('add', value);
			input.val('');
		}
		this.$('.bootstrap-tagsinput').removeClass('active');
	},

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
		this.model.set('observations', this.$('[name=observations]').val());
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'));
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

	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
		this.listenTo(this.model, 'change', this.render);
	},

	afterRender: function(){
		if(this.activated){
			this.activate();
		}
		app.trigger('client:row:rendered');
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

	activateRenderedViews: function(id){
		if(this.model.id === id){
			this.activate();
		}
	},

	deactivate: function(id){
		if(id === this.model.id && this.$el.hasClass('selected')){
			this.activated = false;
			this.$('#show-client>i').removeClass('fa-spin');
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-lg-12',

	cloneModel: null,

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
		var self = this;
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.model.save({}, {
			success: function(model, response, options){
				self.handleSuccess(self ,model, response, options);
			},
		});
		this.model = new App.Models.Client();
		this.render();
		this.$('[name=name]').focus();
	},

	handleSuccess: function(context, model, response, options){
		var attrs = new App.Models.Client(response);
		if (App.defined(app.ClientIndexView) && App.defined(app.ClientIndexView.view)){
			app.ClientIndexView.view.collection.add(attrs);
		}
		context.displayPortletMessage({
			viewCid: context.parent.cid,
			title  : 'Cliente Creado',
			message: 'El nuevo cliente se ha creado con exito.',
			class  : 'success',
		});
	},

	updateForm: function(e){
		e.preventDefault();
		var self = this;
		this.setModel();
		this.model.save({}, {
			success: function(model, response, options){
				self.model.parseAttributes(self.model.attributes);
				self.model.trigger('updated');
			},
		});
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
App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "table-responisve",
	name     : "Clientes",
	
	tableEl        : '#clients-table',
	tableCollection: 'Clients',
	modelView      : App.Views.ClientRowView,
	
	onSync: function(){
		this.collection.fetch();
	},

	setCollection: function(){
		if(!App.defined(app.clients)){
			app.clients = new App.Collections.Clients();
		}
		return app.clients;
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
	modelId : null,

	appEvents: {
		"client:row:rendered": 'announce',
	},

	events:{
		'click #client-edit'            : 'renderForm',
		'click #client-service-requests': 'renderServiceRequests',
	},

	initialize: function(){
		this.update      = _.throttle(this.update, 500);
		this.synchronize = _.throttle(this.synchronize, 500);
		var self = this;
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model = new App.Models.Client();
				this.model.set('_id', this.modelId);
				this.model.id = this.modelId;
				this.model.fetch({
					success: function(){
						self.render();
						self.bindEvents();
					},
				});
			}
		}
	},

	afterRender: function(){
		App.scrollTo(this.parent.el);
		this.announce();
		this.setName();
		this.parent.setHeader();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'updated', this.update);
		this.listenTo(this.model, 'change', this.synchronize);
		this.listenTo(this.app, 'sync:client:' + this.model.id, this.update);
		this.synchronize = _.debounce(this.synchronize, 100);
	},

	setName: function(){
		this.name = 'Cliente: ' + this.model.get('name') + ' #' + this.model.id;
	},

	onSync: function(){
		var self = this;
		this.model.fetch({
			success: function(){
				self.afterSync();
				self.update();
			},
		});
	},

	afterSync: function(){
		app.trigger('portlet:view: '+ this.cid +':sync:spin:stop');
	},

	update: function(){
		this.parent.flash = {
			title  : 'Cliente Actualizado',
			message: 'El cliente se ha actualizado con exito.',
			class  : 'success',
		};
		this.parent.render();
	},

	synchronize: function(){
		this.parent.flash = {
			title   : 'Cliente Desincronizado',
			message : 'Se han realizado cambios en este cliente que no se ven reflejados actualmente. Desea actualizar esta información?',
			htmlMsg : '<p><button type="button" class="btn btn-warning" data-event="sync:client:'+this.model.id+'">Actualizar</button></p>',
			class   : 'warning',
			lifetime: 0,
			method  : 'html',
		};
		this.parent.displayFlash();
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt), {silent: true});
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt), {silent: true});
		return this.model.serialize();
	},

	renderForm: function(){
		if (!App.defined(this.clientForm)){
			this.clientForm = new App.Views.ClientFormView({model: this.model});
			this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
		}
	},

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var id = this.model.id;
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: new App.Collections.ServiceRequests()
			});
			this.serviceRequests.collection.client_id = this.model.id;
			this.serviceRequests.attachTo(this.$('#client-service_requests-'+id), {method: 'html'});
		}
	},

	announce: function(){
		app.trigger('client:show:active', this.model.id);
	},

	beforeDispose: function(){
		app.trigger('client:show:close', this.model.id);
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

	lifetime: 4000,

	events: {
		'click .close': 'closeCallout',
		'click button': 'triggerEvent',
	},

	triggerEvent: function(e){
		var event = e.currentTarget.dataset.event;
		app.trigger(event);
	},

	afterRender: function(){
		var self      = this;
		var className = this.model.get('class');
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(this.lifetime > 0){
			this.timer = setTimeout(function(){
				self.dispose();
			}, this.lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},

	closeCallout: function(){
		if(App.defined(this.timer)){
			clearTimeout(this.timer);
		}
		this.dispose();
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
	viewModelId      : null,
	portletFrameClass: null,
	flash            : null,
	entrance         : 'fadeInLeft',

	appEvents: {
		'portlet:message': 'message',
	},

	events: {
		'click #close'   : 'closeView',
		'click #sync'    : 'syncView',
		'click #collapse': 'collapseView',
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

	collapseView: function(){
		this.$('#collapse i').toggleClass('fa-chevron-uo').toggleClass('fa-chevron-down');
	},

	syncView: function(e){
		e.preventDefault();
		if (App.defined(this.view)){
			if(this.view.canSync()){
				this.$('#sync i').removeClass('fa-undo').addClass('fa-spinner fa-spin');
			} else {
				this.flash = {
					title  : 'Atención',
					message: 'Esta ventana no se puede sincronizar',
					class  : 'warning',
					method : 'html' 
				};
				this.displayFlash();
			}
		}
	},

	stopSpin: function(){
		if (this.$('#sync i').hasClass('fa-spinner')) {
			this.$('#sync i').removeClass('fa-spinner fa-spin').addClass('fa-undo');
			this.flash = {
				title  : 'Datos Actualizados',
				message: 'Los datos se han actualizado correctamente',
				class  : 'success',
			};
			this.displayFlash();
		}
	},

	displayFlash: function(){
		if (App.defined(this.flash)){
			this.showMessage(this.flash);
			this.flash = null;
		}
	},

	startTools: function(){
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setMainChildView: function(){
		if(App.defined(this.viewName)){
			if(App.defined(this.viewModel)){
				this.view = new App.Views[this.viewName]({model: this.viewModel});
			} else if (App.defined(this.viewModelId)) {
				this.view = new App.Views[this.viewName]({modelId: this.viewModelId});
			} else {
				this.view = new App.Views[this.viewName]();
			}
			this.setHeader();
			this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
			this.listenTo(this.app, 'portlet:view: '+ this.view.cid +':sync:spin:stop', this.stopSpin);
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
		var method  = 'prepend';
		if(App.defined(data.lifetime)){
			options.lifetime = data.lifetime;
			delete data.lifetime;
		}
		if(App.defined(data.method)){
			method = data.method;
			delete data.method;
		}
		options.model = new Backbone.Model(data);
		var callout   = new App.Views.BSCalloutView(options);
		this.attach(callout, {el: this.$('#portlet-messages'), method: method});
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
App.Views.ServiceRequestRowView = App.Views.BaseView.extend({
	template: HBS.service_request_row_template,

	tagName  : 'tr',

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.toJSON();
			var appliances = this.model.get('appliances');
			var createdAt = this.model.get('createdAt');
			if (App.defined(appliances)){
				object.appliances_length = this.model.get('appliances').length;	
			}
			if (App.defined(createdAt)){
				object.createdAt = this.model.dateDDMMYYYY(createdAt);
			}
		}
		return object;
	},
});
App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
		'click button[type=submit]'    : 'createServiceRequest',
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self = this;
		var index = e.currentTarget.dataset.index;
		var appliances = this.model.get('appliances');
		var appliance = appliances.at(index);
		appliances.trigger('appliance:deleted');
		appliances.remove(appliance);
		this.$('#appliance-views').empty();
		_.each(appliances.models, function(model){
			self.appendApplianceForm({
				model      : model,
				firstRender: false,
			});
		});
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		var appliances = this.model.get('appliances');
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
		appliances.add(model);
		this.appendApplianceForm({model: model});
	},

	appendApplianceForm: function(options){
		if(!App.defined(options.model)){return new Error('No model was passed in the options.');}
		var appliances = this.model.get('appliances');
		var view       = new App.Views.ApplianceSingleFormView(options);
		var index      = appliances.indexOf(options.model);
		var style      = '';
		if ((index % 2) === 1){style = 'background-color: #E6E6E6';}
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		var grandpa = this.parent.parent;
		if (this.model.get('appliances').length === 0 && App.defined(grandpa)){
			grandpa.flash = {
				title  : 'Atención',
				message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
				class  : 'warning',
				method : 'html' 
			};
			grandpa.displayFlash();
		}
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		this.model.save({}, {
			success: function(model, response, options){
				model.setAppliances();
				app.trigger('service_request:create:success', model);
				grandpa.flash = {
					title   : 'Orden de Servicio Creada',
					message : 'La Orden de Servicio se ha creado con exito!.',
					class   : 'success',
					method  : 'html',
					htmlMsg : '<p><a type="button" class="btn btn-info" href="#render/service_request/show/'+ model.id +'">' + 
										'<i class="fa fa-eye"></i> Abrir Orden de Servicio' + 
										'</a></p>',
					lifetime: 0 
				};
				self.model = new App.Models.ServiceRequest({
					client_name: model.get('client_name'),
					client_id: model.get('client_id'),
				});
				self.render();
				grandpa.displayFlash();
				App.scrollTo(grandpa.el);
			},
		});
	},

	saveModel: function(){
		this.model.set('client_id', this.$('[name=client_id]').val());
		this.model.set('client_name', this.$('[name=client_name]').val());
		this.model.set('invoiceNumber', this.$('[name=invoiceNumber]').val());
	}
});
App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "col-lg-12",
	name     : "Ordenes de Servicio",
	
	tableEl        : '#service_requests-table',
	tableCollection: 'ServiceRequests',
	modelView      : App.Views.ServiceRequestRowView,

	appEvents: {
		'service_request:create:success': 'checkModel',
	},

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	comparator: function(view){
		return (
				view instanceof App.Views.PortletView &&
				view.viewName === "ServiceRequestNewView" &&
				App.defined(view.view) &&
				App.defined(view.view.model) &&
				view.view.model.get('client_id') === this.parent.model.id
			);
	},

	newServiceRequest: function(){
		var targetView = app.Renderer.viewIsRendered(this.comparator, this);
		if (targetView){
			return App.scrollTo(targetView.el);
		}
		var parentModel = this.parent.model;
		var object = {
			client_name: parentModel.get('name'),
			client_id  : parentModel.id,
		};
		var model = new App.Models.ServiceRequest(object);
		var portletView = new App.Views.PortletView({
			viewName: 'ServiceRequestNewView',
			viewModel: model,
		});
		app.Renderer.appendToContent(portletView);
	},

	checkModel: function(model){
		console.log(model);
		if (App.defined(model)){
			var client_id = model.get('client_id');
			if (client_id && client_id === this.parent.model.id){
				this.collection.add(model);
			}
		}
	},
});
App.Views.ServiceRequestNewView = App.Views.BaseView.extend({
	name: "Nueva Orden de Servicio",

	className: "row",

	afterRender: function(){
		this.renderForm();
		var clientName = this.model.get('client_name');
		var clientID   = this.model.get('client_id');
		if(App.defined(clientName) && App.defined(clientID)){
			this.name = "Nueva Orden de Servicio para " + clientName + " #" + clientID;
			this.parent.setHeader();
		}
	},

	renderForm: function(){
		var model;
		if(App.defined(this.model)){
			model = this.model;
		} else {
			model = new App.Models.ServiceRequest();
		}
		this.serviceRequestForm = new App.Views.ServiceRequestFormView({
			model: model
		});
		this.serviceRequestForm.attachTo(this.$el, {method: 'html'});
	},
});
App.Views.ServiceRequestShowView = App.Views.BaseView.extend({
	template: HBS.service_request_show_template,

	name: null,

	initialize: function(){
		var self = this;
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model = new App.Models.ServiceRequest();
				this.model.set('_id', this.modelId);
				this.model.id = this.modelId;
				this.model.fetch({
					success: function(){
						self.render();
						self.bindEvents();
					},
				});
			}
		}
	},

	bindEvents: function(){

	},

	afterRender: function(){
		App.scrollTo(this.parent.el);
		this.announce();
		this.setName();
		this.parent.setHeader();
	},

	setName: function(){
		this.name = 'Orden de Servicio #' + this.model.get('id');
	},

	announce: function(){
		app.trigger('service_request:show:active', this.model.id);
	},

	beforeDispose: function(){
		app.trigger('service_request:show:close', this.model.id);
	},
});
App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/show/:id'                     : 'render:show',
		'render/:doc/:type'                        : 'render:doc',
		':doc/show/:id'                            : 'render:show',
		':doc/:type'                               : 'render:doc',
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