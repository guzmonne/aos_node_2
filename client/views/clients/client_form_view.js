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
		this.model.get('doc').set('type', this.$('[name=doc-type]').val());
		this.model.get('doc').set('number', this.$('[name=doc-number]').val());
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
		this.model.set('id', this.model.cid);
		if (App.defined(app.ClientIndexView)){
			this.app.ClientIndexView.view.collection.add(this.model);
		}
		this.model = new App.Models.Client();
		var message = {
			viewCid: this.parent.cid,
			title  : 'Cliente Creado',
			message: 'El nuevo cliente se ha creado con exito.',
			class  : 'success',
		};
		app.trigger('portlet:message', message);
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