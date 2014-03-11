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
		'click #reset-form'            : 'render',
		'click #update-form'           : 'updateForm',
		'submit form'                  : 'submitForm',
	},

	afterRender: function(){
		this.$('[name=name]').focus();
	},

	serialize: function(){
		this.model.set('phones-length', this.model.get('phones').length);
		this.model.set('addresses-length', this.model.get('addresses').length);
		return this.model.toJSON();
	},

	addPhoneNumber: function(){
		var number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.push('phones', {
			number: number,
		});
		this.reRender('[name=phone]');
	},

	delPhoneNumber:function(e){
		var index = parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex'));
		this.model.pop('phones', index);
		this.reRender('[name=phone]');
	},

	addAddress: function(){
		var street     = this.$('[name=street]').val();
		var city       = this.$('[name=city]').val();
		var department = this.$('[name=department]').val();
		if(street === ""){return;}
		var attrs = {
			street    : street,
			city      : city,
			department: department,
		};
		this.model.push('addresses', attrs);
		this.reRender('[name=street]');
	},

	delAddress: function(e){
		var index = parseInt(this.$(e.currentTarget).closest('button').data('addressIndex'));
		this.model.pop('addresses', index);
		this.reRender('[name=street]');
	},

	setModel: function(){
		this.model.set('name', this.$('[name=name]').val());
		this.model.setn('doc.type', this.$('[name=doc-type]').val());
		this.model.setn('doc.number', this.$('[name=doc-number]').val());
		this.model.set('email', this.$('[name=email]').val());
		var phone  = this.$('[name=phone]').val();
		var street = this.$('[name=street]').val();
		if (phone !== ''){
			this.addPhoneNumber();
		}
		if (street !== ''){
			this.addAddress();
		}
	},

	submitForm: function(e){
		e.preventDefault();
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.app.clientIndex.collection.add(this.model);
		this.reset();
	},

	updateForm: function(e){
		e.preventDefault();
		this.setModel();
		this.model.trigger('updated');
	},

	reRender: function(activeAttr){
		this.render();
		this.$(activeAttr).focus();
	},
});