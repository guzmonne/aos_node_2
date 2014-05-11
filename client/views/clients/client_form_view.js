App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-md-12 col-lg-offset-1 col-lg-9',

	events: {
		'click #add-phone-number'        : 'addPhone',
		'click button.del-phone-number'  : 'delPhone',
		'click button.edit-phone-number' : 'editPhone',
		'click #add-address'             : 'addAddress',
		'click button.del-address'       : 'delAddress',
		'click button.edit-address'      : 'editAddress',
		'click #reset-form'              : 'render',
		'click #update-form'             : 'updateModel',
		'submit form'                    : 'createModel',
	},

	initialize: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:phones'    , this.renderPhones);
		this.listenTo(this.model, 'change:addresses' , this.renderAddresses);
		this.listenTo(this.model, 'change:name'      , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:doc-type'  , function(){this.updateViewField.apply(this, ['doc-type']);});
		this.listenTo(this.model, 'change:doc-number', function(){this.updateViewField.apply(this, ['doc-number']);});
		this.listenTo(this.model, 'change:email'     , function(){this.updateViewField.apply(this, ['email']);});
	},

	afterRender: function(){
		this.renderPhones();
		this.renderAddresses();
	},

	renderPhones: function(){
		this.$('#phone-numbers').html(this.phoneFieldTemplate({
			phones : this.model.phones.toJSON()
		}));
		this.$('[name=phone]').focus();
	},

	addPhone: function(){
		var number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.phones.add({number: number});
	},

	delPhone:function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		this.model.phones.remove(this.model.phones.at(index));
	},

	editPhone: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		var phone = this.model.phones.at(index);
		this.delPhone(index);
		this.$('[name=phone]').val(phone.get('number'));
	},

	renderAddresses: function(){
		this.$('#addresses').html(this.addressFieldTemplate({
			addresses : this.model.addresses.toJSON()
		}));
		this.$('[name=street]').focus();
	},

	addAddress: function(){
		var attrs = _.pick(this.$('form').formParams(), 'street', 'city', 'department');
		if(attrs.street === ""){return;}
		this.model.addresses.add(attrs);
	},

	delAddress: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		this.model.addresses.remove(this.model.addresses.at(index));
	},

	editAddress: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		var address = this.model.addresses.at(index);
		this.delAddress(index);
		this.$('[name=street]').val(address.get('street'));
		this.$('[name=city]').val(address.get('city'));
		this.$('[name=department]').val(address.get('department'));
	},

	setModel: function(){
		this.model.set(_.pick(this.$('form').formParams(), 'name', 'email', 'doc-type', 'doc-number'));
		if(this.$('[name=phone]').val()  !== ''){ this.addPhone(); }
		if(this.$('[name=street]').val() !== ''){ this.addAddress(); }
	},

	createModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Cliente Creado',
					message: 'El nuevo cliente se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model = new App.Models.Client();
		this.bindEvents();
		this.render();
		this.$('[name=name]').focus();
	},

	updateModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		this.setModel();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Datos Actualizados',
					message: 'El cliente se ha actualizado correctamente',
					class  : 'success',
				});
			},
		});
	},

});