App.Views.ClientNewView = App.Views.BaseView.extend({
	template            : HBS.client_new_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,
	className: "row",

	events: {
		'click #add-phone-number'      : 'addPhoneNumber',
		'click button.del-phone-number': 'delPhoneNumber',
		'click #add-address'           : 'addAddress',
		'click button.del-address'     : 'delAddress',
		'submit form'                  : 'submitForm',
	},

	initialize: function(){
		this.model = new App.Models.Client();
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

	submitForm: function(e){
		e.preventDefault();
		this.model.set('name', $('[name=name]').val());
		this.model.setn('doc.type', $('[name=doc-type]').val());
		this.model.setn('doc.value', $('[name=doc-number]').val());
		this.model.set('email', $('[name=email]').val());
		var phone  = $('[name=phone]').val();
		var street = $('[name=street]').val();
		if (phone !== ''){
			this.addPhoneNumber();
		}
		if (street !== ''){
			this.addAddress();
		}
		console.log(this.model.attributes);
	},
});