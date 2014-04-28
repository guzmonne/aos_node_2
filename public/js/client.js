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

	animate: function(el, animation, callback, context){
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback.apply(context);}
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
			'model_id'          : null,
			'serial'            : null,
			'accessories'       : [],
			'client_name'       : null,
			'client_id'         : null,
			'repairment_type'   : 'Garantía',
			'defect'            : null,
			'observations'      : null,
			'status'            : 'Pendiente',
			'cost'              : 0,
			'solution'          : null,
			'diagnose'          : null,
			'replacements'      : [],
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
App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + id;
		}
		return u;
	},

	defaults: function(){
		return {
			'model'      : null,
			'brand'      : null,
			'category'   : null,
			'subcategory': null,
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});
App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	initialize: function(attributes, options){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if(App.defined(attributes) && App.defined(attributes.appliances)){
			this.appliances.reset(attributes.appliances);
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
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
			'closedAt'			: null,
		};
	},

	parse: function(response){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if (App.defined(response.appliances)){
			this.setAppliances(response.appliances);
		}
		return response;
	},

	setAppliances: function(array){
		if (App.defined(array) && _.isArray(array)){
			this.appliances.reset(array);
		}
		return this;
	},

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliances = this.appliances.toJSON();
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
App.Collections.Models = Giraffe.Collection.extend({
	url  : '/api/models',
	model: App.Models.Model,
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
		//this.dispose();
		this.$el.addClass('closing');
		setTimeout(function(){
			self.dispose();
		}, 500);
		//App.animate(this.$el, 'slideOutUp', function(){
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

	titelize: function(doc){
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

	displayPortletMessage: function(options){
		var defaultOptions = {
			viewCid: this.parent.cid,
			title  : 'Titulo:',
			message: 'Cuerpo del mensaje',
		};
		var opts = typeof options !== 'undefined' ? options : defaultOptions; 
		app.trigger('portlet:message', opts);
	},

	blockForm: function(){
		this.$('input').attr('readonly', true);
		this.$('textarea').attr('readonly', true);
		this.$('select').attr('disabled', true);
		this.$('span[data-role=remove]').attr('data-role', 'not-remove');
	},

	unblockForm: function(){
		this.$('input').attr('readonly', false);
		this.$('textarea').attr('readonly', false);
		this.$('select').attr('disabled', false);
		this.$('span[data-role=not-remove]').attr('data-role', 'remove');
	},

	activateTags: function(e){
		if (!e){return;}
		this.$(e.currentTarget).closest('.bootstrap-tagsinput').addClass('active');
	},

	deactivateTags: function(e){
		if (!e){return;}
		var input = this.$(e.target);
		var value = input.val();
		if (value !== ''){
			this.$(e.target.offsetParent).find('select').tagsinput('add', value);
			input.val('');
		}
		this.$('.bootstrap-tagsinput').removeClass('active');
	},
});
App.Views.CarouselView = App.Views.BaseView.extend({
	template: HBS.carousel_template,

	className: "row",

	ui: {
		$range      : "#range-selector",
		$rangeOutput: "output",
		$next       : "#next-model",
		$prev       : "#prev-model",
	},

	events: {
		'change $range': 'moveCarousel',
		'click $next'  : 'updateRange',
		'click $prev'  : 'updateRange',
	},

	initialize: function(){
		if (this.air){
			this.$el.addClass("air-t");
		}
	},

	afterRender: function(){
		var view;
		var carouselItemView = App.Views[this.carouselItemView];
		var options = (this.carouselItemViewOptions) ? this.carouselItemViewOptions : {}; 
		if(!App.defined(carouselItemView)){return;}
		if (!this.collection){return;}
		for(var i = 0; i < this.collection.length; i++){
			options.model     = this.collection.at(i);
			options.className = (i === 0) ? "item active" : "item";
			view              = new carouselItemView(options);
			view.attachTo(this.$('#carousel-items-' + this.cid));
		}
		this.$range.attr("max", this.collection.length);
		this.$('#carousel-' + this.cid).carousel({
      interval: 0,
      pause: "hover"
    });
	},

	serialize: function(){
		var options               = {};
		options.cid               = this.cid;
		options.carouselClassName = (this.carouselClassName) ? this.carouselClassName : null;
		options.carouselTitle     = (this.carouselTitle)     ? this.carouselTitle     : null;
		return options;
	},

	moveCarousel: function(){
		var rangeVal = parseInt(this.$range.val());
		var slide = rangeVal - 1;
		this.$rangeOutput.val(rangeVal);
		this.$('#carousel-' + this.cid).carousel(slide);
	},

	updateRange: function(e){
		var id = e.currentTarget.id;
		var rangeVal = parseInt(this.$range.val());
		if (id === "next-model"){
			rangeVal = rangeVal + 1;
			if (rangeVal > this.collection.length){
				rangeVal = 1;
			}
		} else if (id === "prev-model"){
			rangeVal = rangeVal - 1;
			if (rangeVal <= 0){
				rangeVal = this.collection.length;
			}
		}
		this.$range.val(rangeVal);
		this.$rangeOutput.val(rangeVal);
	},
});
App.Views.ModalView = App.Views.BaseView.extend({
	template: HBS.modal_base_layout_template,
	
	modalOptions: {
		header      : true,
		footer      : true,
		customFooter: false,
		title       : '',
		modalClass  : false,
	},

	initialize: function(){
		if (!this.bodyView){return;}
		if (this.bodyView.modalOptions){_.extend(this.modalOptions, this.bodyView.modalOptions);}
	},

	attributes: function(){
		return {
			'class'          : "modal fade",
			'tabindex'       : "-1",
			'role'           : "dialog",
			'aria-labelledby': this.name,
			'aria-hidden'    : true,
			'id'             : 'modalContainer',
		};
	},

	afterRender: function(){
		this.bodyView.attachTo('.modal-body', {method: 'html'});
	},
	
	serialize: function(){
		return this.modalOptions;
	}
});
App.Views.NewView = App.Views.BaseView.extend({
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		this.formView = new App.Views[this.formViewName]({
			model: new App.Models[this.modelName]()
		});
		this.formView.attachTo(this.$el, {method: 'html'});
	},
});
App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,
	

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.listenTo(this.model, 'updated', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(app, this.modelName + ":show:close", this.deactivate);
		this.listenTo(app, this.modelName + ":show:active", this.activateRenderedViews);
	},

	afterRender: function(){
		if(this.activated){
			this.activate();
		}
		app.trigger(this.modelName + ':row:rendered');
		this.$el.tooltip();
		if(this.parent.selection){
			this.$('a#show').remove();
			this.$('a#selected').removeClass('hide');
		}
		if(_.isFunction(this.onceRendered)){this.onceRendered();}
	},

	selected: function(){
		var data;
		if(this.parent.parentView){
			data = {
				model     : this.model,
				parentView: this.parent.parentView
			};
		} else {
			data = this.model;
		}
		app.trigger(this.modelName + ':selected', data);
		app.modalController.closeModal();
	},

	serialize: function(){
		if(!App.defined(this.model)){return;}
		if (_.isFunction(this.model.serialize)){
			return this.model.serialize();
		} else {
			return this.model.toJSON();
		}
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
			this.$el.removeClass('selected');
			this.className = '';
		}
	},
});
App.Views.TabView = App.Views.BaseView.extend({
	template: HBS.tabs_template,

	tabs      : {},
	tabDetails: {},
	activeView: null,

	events: {},
	
	initialize: function(){
		if(!this.modelName){return new Error('View must have a modelName defined');}
		if(!App.defined(this.model)){
			var titelizeModelName = this.titelize(this.modelName);
			if (App.defined(App.Models[titelizeModelName])){
				this.model = new App.Models[titelizeModelName]();
			} else {
				this.model = new Giraffe.Model();
			}
		}
		this.timestamp = _.uniqueId();
		this.createTabs();
		this.listenTo(app, this.modelName + ':row:rendered', this.announce);
		if (_.isFunction(this.bindEvents)){this.bindEvents();}
		if (_.isFunction(this.afterInitialize)){this.afterInitialize();}
		this.listenTo(this.model, 'sync', this.setHeader);
	},

	createTabs: function(){
		var self   = this;
		var object = {
			modelName: this.modelName,
			tab      : [],
		};
		_.forEach(this.tabs, function(tab, index){
			var tabFunction;
			var tabDetails = {
				href : self.modelName + "-" + tab.id + "-" + self.timestamp,
				id   : self.modelName + "-" + tab.id,
				title: tab.title,
			};
			if (tab.class){
				tabDetails.class = tab.class; 
			}
			if (_.isFunction(tab.renderFunction)){
				tabFunction = tab.renderFunction;
			} else {
				tabFunction = function(){	
					self.renderTabView(tab.id, tab.view);
				};
			}
			if(tab.active){
				tabDetails.active = true;
				self.activeView = tabFunction;
			} else {
				self["renderTab" + index] = tabFunction;
				self.events['click #' + self.modelName + "-" + tab.id] = "renderTab" + index;
			}
			object.tab.push(tabDetails);
		});
		this.tabDetails = object;
	},

	renderTabView: function(id, viewName){
		if (!App.defined(this[id])){
			this[id] = new App.Views[viewName]({model: this.model});
			this[id].attachTo(this.$('#' + this.modelName + '-' + id + '-' + this.timestamp), {method: 'html'});
		}
	},

	afterRender: function(){
		if (_.isFunction(this.activeView)){this.activeView();}
		if (_.isFunction(this.setName)){this.setName();}
		if (_.isFunction(this.parent.setHeader)){this.parent.setHeader();}
		this.announce();
		App.scrollTo(this.parent.el);
	},

	serialize: function(){
		return this.tabDetails;
	},

	beforeDispose: function(){
		if(!App.defined(this.model)){return;}
		app.trigger(this.modelName + ':show:close', this.model.id);
	},

	announce: function(){
		if(!App.defined(this.model)){return;}
		app.trigger(this.modelName + ':show:active', this.model.id);
	},

	setHeader: function(){
		if (App.defined(this.parent) && _.isFunction(this.parent.setHeader)){
			this.parent.setHeader();
		}
	}
});
App.Views.TableView = App.Views.BaseView.extend({
	firstRender   : true,
	rowViewOptions: {},
	fetchOptions	: {},

	initialize: function(){
		var self = this;
		if(App.defined(this.beforeInitialize) && _.isFunction(this.beforeInitialize)){
			this.beforeInitialize();
		}
		if (!App.defined(this.collection)){
			if(_.isFunction(this.setCollection)){
				this.collection = this.setCollection();
			} else {
				this.collection = new this.tableCollection();
			}
		}
		this.listenTo(this.collection, 'add', this.append);
		this.listenTo(this.collection, 'sync', this.afterSync);
		_.bind(this.append, this);
		this.timestamp = _.uniqueId();
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	setCollection: function(){
		if(!App.defined(app[this.appStorage])){
			app[this.appStorage] = new this.tableCollection();
		}
		return app[this.appStorage];
	},

	afterRender: function(){
		if(!App.defined(this.tableEl)){
			return new Error('Attribute tableEl must be set.');
		}
		if (this.firstRender){
			this.oTable = this.$(this.tableEl + "-" + this.timestamp).dataTable();
			if(this.collection.length > 0){
				this.appendCollection(this.collection);
			} else {
				this.collection.fetch(this.fetchOptions);
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
			this.rowViewOptions.model = model;
			var view = new this.modelView(this.rowViewOptions);
			this.addChild(view);
			this.oTable.fnAddTr(view.render().el);
		} else {
			return new Error('Option modelView not defined');
		}
	},

	onSync: function(){
		this.collection.fetch(this.fetchOptions);
	},
});
App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	showView: function(doc, id){
		var docName  = this.titelize(doc);
		var viewName = docName + 'ShowView';
		var model    = this.setModel(doc, id);
		var params   = {
			model            : model,
			viewName         : viewName,
			portletFrameClass: 'green',
		};
		this.showOrGoTo(params, this.showComparator);
	},

	docView: function(doc, type){
		var docName  = this.titelize(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		var params   = {
			viewName: viewName,
		};
		this.showOrGoTo(params);
	},

	setModel: function(doc, id){
		var model;
		var collection = app[doc + 's'];
		var docName    = this.titelize(doc);
		if (App.defined(collection)){
			model = collection.get(id);
		} else {
			model = new App.Models[docName]({_id: id});
			model.fetch();
		}
		return model;
	},

	defaultComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&& 
			App.defined(view.viewName)							&& 
			view.viewName === this.viewName
		);
	},

	showComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&&
			App.defined(view.view)									&&
			App.defined(view.view.model)						&&
			view.view.model.id === this.model.id
		);
	},

	showOrGoTo: function(params, comparator){
		if(	!App.defined(params)										|| 
				!App.defined(params.viewName)						|| 
				!App.defined(App.Views[params.viewName])
		){
			return;
		}
		var viewRef;
		Backbone.history.navigate((Backbone.history.fragment).replace('render/', ''));
		params     = (params)     ? params     : {};
		comparator = (comparator) ? comparator : this.defaultComparator;
		viewRef    = this.viewIsRendered(comparator, params);
		if (viewRef){
			App.scrollTo(viewRef.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		if(!App.defined(params) || !params.viewName){
			return new Error('The viewName option must be set');
		}
		var options = {};
		if(params.model){
			options.model = params.model;
			delete params.model;
		}
		params.view     = new App.Views[params.viewName](options);
		var portletView = new App.Views.PortletView(params);
		//if(options.model){
		//	portletView.view.model.fetch();
		//}
		this.appendToContent(portletView);
		App.scrollTo(portletView.el);
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
App.Views.ApplianceRowView = App.Views.BaseView.extend({
	template: HBS.appliance_row_template,

	tagName  : 'tr',

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			var createdAt    = this.model.get('createdAt');
			var updatedAt    = this.model.get('updatedAt');
			var closedAt     = this.model.get('closedAt');
			object           = this.model.toJSON();
			_.extend(object, this.model.get('model_id'));
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});
App.Views.ApplianceCarouselView = App.Views.CarouselView.extend({
	air              : true,
	carouselItemView : "ApplianceEditFormView",
	carouselClassName: "col-lg-offset-2 col-lg-8 col-md-12",
	carouselTitle    : "Equipos",
});
App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template, 

	className: "row",

	events: {
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "rerender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'changeRepairementType',
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		this.blockForm();
		this.toggleButtons();
		this.changeStatus();
		this.changeRepairementType();
	},

	toggleButtons: function(){
		this.$('button').toggleClass('hide');
	},

	changeStatus: function(){
		var statusSelect = this.$('[name=status]');
		var viewStatus = statusSelect.val();
		var statusClass;
		switch (viewStatus){
			case "Pendiente":
				statusClass = "status-pending";
				break;
			case "Atrasado":
				statusClass = "status-late";
				break;
			case "Abierto":
				statusClass = "status-opened";
				break;
			case "Cerrado":
				statusClass = "status-closed";
				break;
			default:
				statusClass = "status-pending";
				break;
		}
		this.$('[name=status]').closest('.form-group').removeClass().addClass("form-group " + statusClass);
	},

	changeRepairementType: function(){
		var repairementTypeVal = this.$('[name=repairement_type]').val();
		if (repairementTypeVal === "Garantía"){
			this.$('#cost-form-group').hide();
		} else {
			this.$('#cost-form-group').show();
		}
	},

	editAppliance: function(e){
		e.preventDefault();
		this.unblockForm();
		this.toggleButtons();
	},

	saveAppliance: function(e){
		var self    = this;
		e.preventDefault();
		this.saveModel();
		this.model.save({}, {
			success: function(){
				var options = {
					title  : 'Equipo Actualizado',
					message: 'El equipos se ha actualizado con exito',
					class  : 'success'
				};
				var view = new App.Views.BSCalloutView({
					model: new Giraffe.Model(options)
				});
				view.attachTo(self.$('#message'), {method: 'html'});
			}
		});
		this.blockForm();
		this.toggleButtons();
	},

	rerender: function(e){
		e.preventDefault();
		this.render();
	},

	serialize: function(){
		var result = this.model.toJSON();
		_.extend(result, this.model.get('model_id'));
		console.log(result);
		return result;
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
		this.model.set('status', this.$('[name=status]').val());
		this.model.set('cost', this.$('[name=cost]').val());
		this.model.set('replacements', this.$('[name=replacements]').val());
		this.model.set('diagnose', this.$('[name=diagnose]').val());
		this.model.set('solution', this.$('[name=solution]').val());
		this.model.set('technician_id', this.$('[name=technician_id]').val());
	},
});
App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template : HBS.appliance_index_template,
	className: "row air-b",
	name     : "Equipos",
	
	tableEl        : '#appliances-table',
	tableCollection: App.Collections.Appliances,
	modelView      : App.Views.ApplianceRowView,

	appStorage: 'appliances',
});
App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'focus .bootstrap-tagsinput input'   : 'activateTags',
		'focusout .bootstrap-tagsinput input': 'deactivateTags',
		'click button#select-model'          : 'selectModel',
	},

	appEvents: {
		'model:selected': 'modelSelected',
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
		this.$('[name=accessories]').tagsinput();
		this.$('[name=serial]').focus();
	},

	modelSelected: function(data){
		if(data.parentView !== this.cid){return;}
		var attrs = _.pick(data.model.attributes,  
			'brand', 
			'model', 
			'category', 
			'subcategory'
		);
		attrs.model_id = data.model.get('_id'); 
		this.model.set(attrs);
		this.render();
	},

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set('serial', this.$('[name=serial]').val());
		this.model.set('observations', this.$('[name=observations]').val());
		this.model.set('repairement_type', this.$('[name=repairement_type]').val());
		this.model.set('defect', this.$('[name=defect]').val());
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'));
	}, 

	selectModel: function(){
		if(!this.modelSelectModalView){
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
			this.modelSelectModalView.parentView = this.cid;
		}
		app.modalController.displayModal(this.modelSelectModalView);
	},
});
App.Views.ClientRowView = App.Views.RowView.extend({
	template : HBS.client_row_template,
	modelName: 'client',
});
App.Views.ClientDetailsView = App.Views.BaseView.extend({
	template: HBS.client_details_template,

	className: 'row',

	initialize: function(){
		if(this.model){
			this.listenTo(this.model, 'sync', this.render);
		}
	},

	serialize: function(){
		var result       = (App.defined(this.model)) ? this.model.serialize() : {};
		var createdAt    = this.model.get('createdAt');
		var updatedAt    = this.model.get('updatedAt');
		result.createdAt = this.model.dateDDMMYYYY(createdAt);
		result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
		return result;
	},
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-md-12 col-lg-offset-1 col-lg-9',

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
		var newModel = new App.Models.Client(response);
		if(
			App.defined(app.clients) &&
			app.clients instanceof Giraffe.Collection
		){
			app.clients.add(newModel);
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
	className: "row",
	name     : "Clientes",
	
	tableEl        : '#clients-table',
	tableCollection: App.Collections.Clients,
	modelView      : App.Views.ClientRowView,

	appStorage      : 'clients',
	fetchOptions		: {
		data: {
			fields: '-service_requests'
		}
	},
});
App.Views.ClientNewView = App.Views.NewView.extend({	
	name        : "Nuevo Cliente",
	formViewName: "ClientFormView",
	modelName   : "Client",
});
App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.clientIndex = new App.Views.ClientIndexView();
		this.clientIndex.selection = true;
		this.clientIndex.attachTo('#client-index');
	},
});
App.Views.ClientShowView = App.Views.TabView.extend({
	
	name: function(){
		return 'Cliente: ' + this.model.get('name') + ' #' + this.model.get('id');
	},

	modelId  : null,
	modelName: 'client',

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ClientDetailsView',
			active: true,
		},
		{
			id            : 'service_requests',
			title         : 'Ordenes de Servicio',
			class         : 'air-t',
			renderFunction: function(){
				this.renderServiceRequests();
			},
		},
		{
			id   : 'edit',
			title: 'Editar Datos',
			class: 'air-t row',
			view : 'ClientFormView',
		}
	],

	bindEvents: function(){
		this.listenTo(this.model, 'updated', this.update);
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

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: new App.Collections.ServiceRequests()
			});
			this.serviceRequests.collection.client_id = this.model.id;
			this.serviceRequests.attachTo(this.$('#client-service_requests-'+ this.timestamp), {method: 'html'});
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
App.Views.MessagesLayoutView = Giraffe.View.extend({
	template: HBS.messages_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.ModalController = App.Views.BaseView.extend({
	currentModal: null,

	tagName: 'section',
	id     : 'modal-el',

	displayModal: function(view){
		if(!App.defined(this.currentModal) || this.currentModal.bodyView.cid !== view.cid){
			this.setCurrentModal(view);
		}	
		this.$('#modalContainer').modal('show');
	},

	setCurrentModal: function(view){
		if(this.currentModal){this.currentModal.dispose();}
		this.currentModal = new App.Views.ModalView({bodyView: view});
		this.attach(this.currentModal, {el: this.el, method: 'html'});
	},

	closeModal: function(){
		this.$('#modalContainer').modal('hide');
	}
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

	afterRender: function(options){
		this.setFrame();
		this.setMainChildView();
		this.startTooltips();
		this.displayFlash();
		this.setHeader();
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

	startTooltips: function(){
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setMainChildView: function(){
		if(!App.defined(this.viewName)){return new Error('ViewName must be set');}
		if(!this.view){
				this.view = new App.Views[this.viewName]();
		}
		this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
		this.listenTo(this.app, 'portlet:view: '+ this.view.cid +':sync:spin:stop', this.stopSpin);
	},

	setHeader: function(){
		this.$('#portlet-title-header').text(_.result(this.view, 'name'));
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
		if(data.method){
			method = data.method;
			delete data.method;
		}
		options.model = new Backbone.Model(data);
		var callout   = new App.Views.BSCalloutView(options);
		this.attach(callout, {el: this.$('#portlet-messages'), method: method});
	},

	serialize: function(){
		return {
			cid: this.cid,
		};
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
App.Views.ModelRowView = App.Views.RowView.extend({
	template : HBS.model_row_template,
	modelName: 'model',
});
App.Views.ModelFormView = App.Views.BaseView.extend({
	template: HBS.model_form_template,

	events: {
		'submit form': 'createModel',
	},

	createModel: function(e){
		var self = this;
		e.preventDefault();
		this.saveModel();
		this.model.save({}, {
			success: function(){
				self.displayPortletMessage({
					viewCid: self.parent.cid,
					title  : 'Modelo Creado',
					message: 'El nuevo modelo se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model.dispose();
		this.model = new App.Models.Model();
		this.cleanForm();
	},

	saveModel: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
	},

	cleanForm: function(){
		this.$('[name=brand]').val('');
		this.$('[name=model]').val('');
		this.$('[name=category]').val('');
		this.$('[name=subcategory]').val('');
	}
});
App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modeles",
	
	tableEl        : '#models-table',
	tableCollection: App.Collections.Models,
	modelView      : App.Views.ModelRowView,

	appStorage  : 'models',
	fetchOptions		: {
		data: {
			fields: 'brand model category subcategory'
		}
	},
});
App.Views.ModelNewView = App.Views.NewView.extend({
	name        : "Nuevo Modelo",
	formViewName: "ModelFormView",
	modelName   : "Model",
});
App.Views.ModelSelectModalView = App.Views.BaseView.extend({
	template: HBS.model_select_modal_template,
	
	name      : "ModelSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Modelo",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.modelIndex = new App.Views.ModelIndexView();
		this.modelIndex.selection  = true;
		this.modelIndex.parentView = this.parentView;
		this.modelIndex.attachTo('#model-index');
	},
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
			var appliances = this.model.appliances;
			var createdAt = this.model.get('createdAt');
			if (App.defined(appliances)){
				object.appliances_length = appliances.length;	
			}
			if (App.defined(createdAt)){
				object.createdAt = this.model.dateDDMMYYYY(createdAt);
			}
		}
		return object;
	},
});
App.Views.ServiceRequestDetailsView = App.Views.BaseView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	initialize: function(){
		if (this.model){
			this.listenTo(this.model, 'sync', this.render);
		}
	},

	afterRender: function(){
		if(
				!App.defined(this.appliancesIndex)	&& 
				App.defined(this.model)							&&
				App.defined(this.model.appliances)	&&
				this.model.appliances.length > 0
		){
			this.model.appliances.client_id = this.model.id;
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection: this.model.appliances,
			});
			this.appliancesIndex.attachTo(this.$('#service-request-appliances'), {
				method: 'html'
			});
		}
		this.parent.setName();
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		if(result.status){
			var label;
			switch (result.status){
				case "Pendiente":
					label = "label-primary";
					break;
				case "Abierto":
					label = "label-info";
					break;
				case "Atrasaodo":
					label = "label-danger";
					break;
				case "Cerrado":
					label = "label-success";
					break;
				default:
					label = "label-default";
			}
			result.label = label;
		}
		return result;
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
		'click button#select-client'   : 'selectClient',
	},

	appEvents: {
		'client:selected': 'setClient',
	},

	afterRequest: function(){
		this.$el.tooltip();
	},

	serviceRequestSuccessFlash: function(id){
		return {
			title   : 'Orden de Servicio Creada',
			message : 'La Orden de Servicio se ha creado con exito!.',
			class   : 'success',
			method  : 'html',
		};
	},

	zeroAppliancesFlash: {
		title  : 'Atención',
		message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
		class  : 'warning',
		method : 'html' 
	},

	selectClient: function(){
		if(!this.clientSelectModalView){
			this.clientSelectModalView = new App.Views.ClientSelectModalView();
		}
		app.modalController.displayModal(this.clientSelectModalView);
	},

	setClient: function(model){
		this.model.set('client_id', model.get('_id'));
		this.model.set('client_name', model.get('name'));
		this.render();
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self       = this;
		var index      = e.currentTarget.dataset.index;
		var appliances = this.model.appliances;
		var appliance  = appliances.at(index);
		appliances.trigger('appliance:deleted');
		appliances.remove(appliance);
		this.$('#appliance-views').empty();
		_.each(appliances.models, function(model){
			self.appendApplianceForm({
				model      : model,
				firstRender: false,
			});
		});
		if(appliances.length === 0){this.$('button[type=submit]').attr('disabled', true);}
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		var appliances = this.model.appliances;
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
		this.$('button[type=submit]').attr('disabled', false);
		appliances.add(model);
		this.appendApplianceForm({model: model});
	},

	appendApplianceForm: function(options){
		if(!App.defined(options.model)){return new Error('No model was passed in the options.');}
		var appliances = this.model.appliances;
		var view       = new App.Views.ApplianceSingleFormView(options);
		var index      = appliances.indexOf(options.model);
		var style      = '';
		if ((index % 2) === 1){style = 'background-color: #E6E6E6';}
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
		if(index === (appliances.length - 1)){
			App.scrollTo(view.$el);
		}
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		var grandpa = this.parent.parent;
		if (this.model.appliances.length === 0 && App.defined(grandpa)){
			grandpa.flash = this.zeroAppliancesFlash;
			grandpa.displayFlash();
		}
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		this.model.save(this.model.serialize(), {
			success: function(model, response, options){
				app.trigger('service_request:create:success', model);
				if(App.defined(app.serviceRequests)){
					app.serviceRequests.add(model);
				}
				if(App.defined(app.appliances)){
					app.appliances.add(model.appliances.models);
				}
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					model            : model,
					portletFrameClass: 'green',
					flash            : self.serviceRequestSuccessFlash(model.id)
				});
				grandpa.dispose();
			},
		});
	},

	saveModel: function(){
		this.model.set('client_id', this.$('[name=client_id]').val());
		this.model.set('client_name', this.$('[name=client_name]').val());
		this.model.set('invoiceNumber', this.$('[name=invoiceNumber]').val());
	},
});
App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template : HBS.service_request_index_template,
	className: "row",
	name     : "Ordenes de Servicio",
	
	tableEl        : '#service_requests-table',
	tableCollection: App.Collections.ServiceRequests,
	modelView      : App.Views.ServiceRequestRowView,

	appStorage: 'serviceRequests',

	appEvents: {
		"service_request:create:success": 'checkCreatedModel', 
	},

	events:{
		'click button#new-service-request': 'newServiceRequest',
	},

	comparator: function(portletView){
		return (
				portletView instanceof App.Views.PortletView &&
				portletView.viewName === "ServiceRequestNewView" &&
				App.defined(portletView.view) &&
				App.defined(portletView.view.model) &&
				portletView.view.model.get('client_id') === this.parent.model.id
			);
	},

	newServiceRequest: function(){
		if(!this.parent.model || !(this.parent.model instanceof App.Models.Client)){
			Backbone.history.navigate('render/service_request/new', {trigger: true});
			return;
		}
		var targetView = app.Renderer.viewIsRendered(this.comparator, this);
		if (targetView){
			return App.scrollTo(targetView.el);
		}
		var parentModel = this.parent.model;
		var object = {
			client_name: parentModel.get('name'),
			client_id  : parentModel.get('_id')
		};
		var model = new App.Models.ServiceRequest(object);
		app.Renderer.show({
			viewName: 'ServiceRequestNewView',
			model: model
		});
	},

	checkCreatedModel: function(model){
		if (this.collection === app.serviceRequests){ return; }
		if (
			App.defined(this.parent)												&&
			App.defined(this.parent.model)									&&
			this.parent.model instanceof App.Models.Client	&&
			this.parent.model.id === model.get('client_id')
		){
			this.collection.add(model);
		}
	},
});
App.Views.ServiceRequestNewView = App.Views.BaseView.extend({
	name: function(){
		var clientName, clientID;
		var result = "Nueva Orden de Servicio";
		if (!App.defined(this.model)){return result;}
		clientName = this.model.get('client_name');
		clientID   = this.model.get('client_id');
		if(App.defined(clientName) && App.defined(clientID)){
			return "Nueva Orden de Servicio para " + clientName;
		} else {
			return result;
		}
	},

	className: "row",

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.ServiceRequest();
		}
	},

	afterRender: function(){
		this.renderForm();
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
		this.listenTo(this.serviceRequestForm.model, 'change:client_name', this.updateName);
	},

	updateName: function(){
		if(this.parent){
			this.parent.setHeader(this.name());
		}
	},
});
App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	name     : null,
	modelId  : null,
	modelName: 'service_request',

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ServiceRequestDetailsView',
			active: true,
		},
		{
			id            : 'appliances',
			title         : 'Equipos',
			renderFunction: function(){
				this.renderAppliancesCarousel();
			},
		}
	],

	renderAppliancesCarousel: function(){
		if (!this.appliancesCarousel){
			if (!App.defined(this.model) || 
				!App.defined(this.model.appliances)
			){
				return;
			}
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				collection : this.model.appliances,
			});
			this.appliancesCarousel.attachTo(
				this.$('#' + this.modelName + '-appliances-' + this.timestamp), 
				{
					method: 'html',
				}
			);
		}
	},

	setName: function(){
		this.name = 'Orden de Servicio #' + this.model.get('id');
		this.parent.setHeader();
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