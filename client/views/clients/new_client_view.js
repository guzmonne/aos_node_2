App.Views.NewClientView = Giraffe.View.extend({
	template            : HBS.new_client_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,
	className: "row",

	events: {
		'click #add-phone-number'      : 'addPhoneNumber',
		'click button.del-phone-number': 'delPhoneNumber',
		'click #add-address'           : 'addAddress',
		'click button.del-address'     : 'delAddress',
	},

	addPhoneNumber: function (e) {
		var phoneNumber = $('[name=phone]');
		var timestamp   = new Date().getTime();
		if (phoneNumber.val() === ""){return;}
		$('#phone-numbers').append(
			this.phoneFieldTemplate({
				phoneNumber: phoneNumber.val(),
				timestamp  : timestamp
			})
		);
		this.pluralize($('[data-phone-id]').length, '[for="phone"]', 'Telefono', 'Telefonos');
		phoneNumber.focus();
		phoneNumber.val('');
	},


	addAddress: function(e){
		var street     = $('[name=street]');
		var city       = $('[name=city]');
		var department = $('[name=department]');
		var timestamp  = new Date().getTime();
		if(street.val() === ""){return;}
		$('#addresses').append(
			this.addressFieldTemplate({
				street    : street.val(),
				city      : city.val(),
				department: department.val(),
				timestamp : timestamp
			})
		);
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
		street.focus();
		street.val('');
		city.val('');
		department.val('');
	},

	delPhoneNumber: function(e){
		var id = $(e.currentTarget).closest('button').data('phoneId');
		$('#' + id).parent().remove();
		$('[data-phone-id=' + id + ']').parent().remove();
		this.pluralizePhones();
	},

	delAddress: function(e){
		var id = $(e.currentTarget).closest('button').data('addressId');
		console.log(e, id);
		$('[data-address-id='+id+']').remove();
		this.pluralize($('[data-address-id]').length, '[for="address"]', 'Dirección', 'Direcciones');
	},

	pluralizePhones: function(){
		if ($('[data-phone-id]').length > 0){
			$('[for="phone"]').text('Telefonos');
		} else {
			$('[for="phone"]').text('Telefono');
		}
	},

	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 0){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

});