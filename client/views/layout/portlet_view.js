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
		var method  = 'prepend';
		if(data.method){
			method = data.method;
			delete data.method;
		}
		var callout   = new App.Views.BSCalloutView({
			data: data,
		});
		this.attach(callout, {el: this.$('#portlet-messages'), method: method});
	},

	serialize: function(){
		return {
			cid: this.cid,
		};
	},

	closePortletView: function(){
		this.dispose();
	},
});