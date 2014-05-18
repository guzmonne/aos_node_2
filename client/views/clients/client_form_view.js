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
		'click #reset-form'              : 'resetForm',
		'click #update-form'             : 'updateModel',
		'click #edit-form'               : 'toggleButtons',
		'submit form'                    : 'createModel',
	},

	initialize: function(){
		this.bindEvents();
		this.cloneModelCollections();
	},

	cloneModelCollections: function(){
		if (!this.model){return;}
		var phones    = this.model.phones;
		var addresses = this.model.addresses;
		if(phones)   { this.phonesClone    = this.model.phones.clone(); }
		if(addresses){ this.addressesClone = this.model.addresses.clone(); }
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
		if(!this.model.isNew()){this.blockForm();}
	},

	resetForm: function(e){
		e.preventDefault();
		if (this.model && this.model.phones && this.phonesClone){
			this.model.phones.reset(this.phonesClone.models);
		}
		if (this.model && this.model.addresses && this.addressesClone){
			this.model.addresses.reset(this.addressesClone.models);
		}
		this.render();
	},

	blockForm: function(){
		//App.Views.BaseView.prototype.blockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').hide();
		this.$('[name=name]'      ).attr("readonly", true);
		this.$('[name=doc-type]'  ).attr("readonly", true);
		this.$('[name=doc-number]').attr("readonly", true);
		this.$('[name=email]'     ).attr("readonly", true);
		this.$('[name=phone]'     ).hide();
		this.$('[name=street]'    ).hide();
		this.$('[name=city]'      ).hide();
		this.$('[name=department]').hide();
		this.$('[name=address-edit-row]').hide();
		this.$('.form-control-under label[for=address]').show();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	unblockForm: function(){
		//App.Views.BaseView.prototype.unblockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').show();
		this.$('[name=name]'      ).attr("readonly", false);
		this.$('[name=doc-type]'  ).attr("readonly", false);
		this.$('[name=doc-number]').attr("readonly", false);
		this.$('[name=email]'     ).attr("readonly", false);
		this.$('[name=phone]'     ).show();
		this.$('[name=street]'    ).show();
		this.$('[name=city]'      ).show();
		this.$('[name=department]').show();
		this.$('[name=address-edit-row]').show();
		this.$('.form-control-under label[for=address]').hide();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	toggleButtons: function(){
		if (this.$('#update-form').hasClass('hide')){
			this.unblockForm();
		} else {
			this.blockForm();
		}
		this.$('.update-buttons').toggleClass('hide');
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
		this.$('.form-control-under label[for=address]').hide();
	},

	addAddress: function(){
		var attrs = _.pick(this.$('form').formParams(), 'street', 'city', 'department');
		if(attrs.street === ""){return;}
		this.model.addresses.add(attrs);
	},

	delAddress: function(e){//
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
		this.model = app.storage.newModel("clients");
		this.bindEvents();
		this.render();
		this.$('[name=name]').focus();
	},

	updateModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		this.setModel();
		this.toggleButtons();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Datos Actualizados',
					message: 'El cliente se ha actualizado correctamente',
					class  : 'success',
				});
			},
		});
		this.cloneModelCollections();
	},

	dispose: function(){
		if (this.phonesClone)   { this.phonesClone.dispose(); }
		if (this.addressesClone){ this.addressesClone.dispose(); }
		Giraffe.dispose.apply(this, arguments);
	},

});