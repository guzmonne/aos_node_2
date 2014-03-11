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