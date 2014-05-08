App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-md-12 col-lg-offset-1 col-lg-9',

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
		this.model.phones.add({number: number});
	},

	delPhoneNumber:function(e){
		var index  = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		var model  = this.model.phones.models[index];
		this.model.phones.remove(model);
		this.reRender('[name=phone]');
	},

	editPhoneNumber: function(e){
		var index  = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		var model  = this.model.phones.models[index];
		this.model.phones.remove(model);
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
		this.model.addresses.add(attrs);
	},

	delAddress: function(e){
		var index     = parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex'));
		var model     = this.model.addresses.models[index];
		this.model.addresses.remove(model);
		this.reRender('[name=street]');
	},

	editAddress: function(e){
		var index     = parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex'));
		var model     = this.model.addresses.models[index];
		this.model.addresses.remove(model);
		this.reRender('[name=street]');
		this.$('[name=street]').val(model.get('street'));
		this.$('[name=city]').val(model.get('city'));
		this.$('[name=department]').val(model.get('department'));
	},

	setModel: function(){
		this.model.set('name'      , this.$('[name=name]').val());
		this.model.set('doc-type'  , this.$('[name=doc-type]').val());
		this.model.set('doc-number', this.$('[name=doc-number]').val());
		this.model.set('email'     , this.$('[name=email]').val());
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
		this.model.createChilds();
		this.setModel();
		this.model.save(this.model.serialize(), {
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
		context.invoke('showMessage', {
			title  : 'Cliente Creado',
			message: 'El nuevo cliente se ha creado con exito.',
			class  : 'success',
		});
	},

	updateForm: function(e){
		e.preventDefault();
		var self = this;
		this.setModel();
		this.model.save(this.model.serialize(), {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Datos Actualizados',
					message: 'El cliente se ha actualizado correctamente',
					class  : 'success',
				});
				self.render();
			},
		});
	},

	reRender: function(elToFocus){
		this.setModel();
		this.render();
		if (
			_.isObject(elToFocus)                             && 
			elToFocus.currentTarget !== undefined             &&
			elToFocus.currentTarget.dataset !== undefined     &&
			elToFocus.currentTarget.dataset.for !== undefined
		){
			this.$('[name='+ elToFocus.currentTarget.dataset.for +']').focus();
		} else {
			this.$(elToFocus).focus();
		}
	},
});