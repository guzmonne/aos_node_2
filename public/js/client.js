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

	appliances: null,

	initialize: function(attributes, options){
		this.appliances = new App.Collections.Appliances();
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
		if(App.defined(this.appliances)){
			attributes.appliances = this.appliances.toJSON();
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
App.Views.TableView = App.Views.BaseView.extend({
	firstRender   : true,
	rowViewOptions: {},

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
		this.timestamp = new Date().getTime();
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
			this.rowViewOptions.model = model;
			var view = new this.modelView(this.rowViewOptions);
			this.addChild(view);
			this.oTable.fnAddTr(view.render().el);
		} else {
			return new Error('Option modelView not defined');
		}
	},

	onSync: function(){
		this.collection.fetch();
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
		var params   = {
			viewModelId      : id,
			viewName         : viewName,
			portletFrameClass: 'green',
		};
		this.checkViewName(params, doc + '/show/' + id, this.showComparator);
		//this.checkViewName(viewName, doc + '/show/' + id, params);
	},

	docView: function(doc, type){
		var docName  = this.titelize(doc);
		var typeName = this.capitaliseFirstLetter(type);
		var viewName = docName + typeName + 'View';
		var params   = {
			viewName: viewName,
		};
		this.checkViewName(params, doc + '/' + type);
	},

	checkViewName: function(params, route, comparator){
		if(
			App.defined(params)						&&
			App.defined(params.viewName)	&&
			App.defined(App.Views[params.viewName])
		){
			Backbone.history.navigate(route);
			this.showOrGoTo(params, comparator);
		} else {
			return;
		}
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

	showOrGoToOld: function(viewName, params){
		var rendered, viewRef, portletFrameClass;
		params = (params) ? params : {};
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
			params.portletFrameClass = portletFrameClass;
			params.viewName          = viewName;
			this.show(params);
		}
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
			view.view.model.id === this.viewModelId
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
		params     = (params) ? params : {};
		comparator = (comparator) ? comparator : this.defaultComparator;
		viewRef    = this.viewIsRendered(comparator, params);
		if (viewRef){
			App.scrollTo(viewRef.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		var options = (params) ? params : {};
		if (!options.portletFrameClass){
			delete options.portletFrameClass;
		}
		if(!options.viewName){return new Error('The viewName option must be set');}
		var view = new App.Views.PortletView(options);
		this.appendToContent(view);
		App.scrollTo(view.el);
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
			object.createdAt	=	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt	=	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt		=	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)	: null;
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
		return this.model.toJSON();
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
App.Views.ClientDetailsView = App.Views.BaseView.extend({
	template: HBS.client_details_template,

	className: 'row',

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

	appStorage : 'clients',
});
App.Views.ClientNewView = App.Views.NewView.extend({	
	name        : "Nuevo Cliente",
	formViewName: "ClientFormView",
	modelName   : "Client",
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
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			this.model = new App.Models.Client();
		}
		this.timestamp = new Date().getTime();
	},

	afterRender: function(){
		var self = this;
		if(this.model.isNew() && App.defined(this.modelId)){
			this.model.set('_id', this.modelId);
			this.model.fetch({
				success: function(){
					self.render();
					self.bindEvents();
				},
				error: function(){
					self.parent.dispose();
				},
			});
		}	else {
			if (App.defined(this.renderChilds) && _.isFunction(this.renderChilds)){
				this.renderChilds();
			}
			this.announce();
			this.setName();
			this.parent.setHeader();
			App.scrollTo(this.parent.el);

		}
	},

	renderChilds: function(){
		this.renderDetails();
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
		var result = (App.defined(this.model)) ? this.model.serialize() : {};
		result.timestamp = this.timestamp;
		return result;
	},

	renderForm: function(){
		if (!App.defined(this.clientForm)){
			var id = this.timestamp;
			this.clientForm = new App.Views.ClientFormView({model: this.model});
			this.clientForm.attachTo(this.$('#client-form-'+id), {method: 'html'});
		}
	},

	renderDetails: function(){
		if (!App.defined(this.clientDetails)){
			var id = this.timestamp;
			this.clientDetails = new App.Views.ClientDetailsView({model: this.model});
			this.clientDetails.attachTo(this.$('#client-details-'+id), {method: 'html'});
		}
	},

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var id = this.timestamp;
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
		if(data.lifetime){
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
App.Views.ModelNewView = App.Views.NewView.extend({
	name        : "Nuevo Modelo",
	formViewName: "ModelFormView",
	modelName   : "Model",
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
App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
		'click button[type=submit]'    : 'createServiceRequest',
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

	deleteAppliance: function(e){
		e.preventDefault();
		var self = this;
		var index = e.currentTarget.dataset.index;
		var appliances = this.model.appliances;
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
		var appliances = this.model.appliances;
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
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
					viewModel        : model,
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
	}
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
			client_id  : parentModel.id,
		};
		var model = new App.Models.ServiceRequest(object);
		var portletView = new App.Views.PortletView({
			viewName: 'ServiceRequestNewView',
			viewModel: model,
		});
		app.Renderer.appendToContent(portletView);
		App.scrollTo(portletView.el);
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
	name: "Nueva Orden de Servicio",

	className: "row",

	initialize: function(){
		if (!App.defined(this.model)){
			this.model = new App.Models.ServiceRequest();
		}
	},

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

	events: {
		'click .sr-appliances' : 'renderAppliancesCarousel',
	},

	initialize: function(){
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model = new App.Models.ServiceRequest();
			}
		}
		this.timestamp = new Date().getTime();
	},

	afterRender: function(){
		var self = this;
		if(this.model.isNew() && App.defined(this.modelId)){
			this.model.set('_id', this.modelId);
			this.model.fetch({
				success: function(){
					self.render();
					self.bindEvents();
				},
				error: function(){
					self.parent.dispose();
				},
			});
		} else {
			if (_.isFunction(this.renderChilds)){
				this.renderChilds();
			}
			this.announce();
			this.setName();
			this.parent.setHeader();
			App.scrollTo(this.parent.el);
		}
	},

	renderChilds: function(){
		this.renderAppliancesIndex();
	},

	renderAppliancesIndex: function(){
		if(
				!App.defined(this.appliancesIndex)	&& 
				App.defined(this.model)							&&
				App.defined(this.model.appliances)
		){
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection: this.model.appliances,
				portlet   : this.parent,
			});
			this.appliancesIndex.attachTo(this.$('#service-request-appliances'), {
				method: 'html'
			});
		}
	},
	
	bindEvents: function(){},

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
				this.$('#service-request-appliances-' + this.timestamp), 
				{
					method: 'html',
				}
			);
		}
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
App.GiraffeApp = Giraffe.App.extend({
	template: HBS.app_template,

	// Collection storage
	clients: null,
});

// var app     = new Giraffe.App();
var app = new App.GiraffeApp();
// app.template  = HBS.app_template;
// app.className = "row";

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