App.Views.ApplianceMultipleFormDetailsModalView = App.Views.BaseView.extend({
	template: HBS.appliance_multiple_form_details_modal_template,
	row     : HBS.appliance_multiple_form_details_modal_row_template,
	name      : "ApplianceMultipleFormDetailsModalView",
	
	className: "row",

	modalOptions: {
		title     : "Detalles",
		footer    : false,
		modalClass: "modal-lg",
	},

	events: {
		'click button[name=save-details]'   : 'saveDetails',
		'change input[type=checkbox]'       : 'applyFilters',
		'change input[name=serial]'         : function(e){this.updateDetails(e, "serial");},
		'change select[name=accessories]'   : function(e){this.updateDetails(e, "accessories");},
		'change textarea[name=observations]': function(e){this.updateDetails(e, "observations");},
		'change textarea[name=defect]'      : function(e){this.updateDetails(e, "defect");},
	},

	initialize: function(){
		this.details = (this.details) ? this.details : {};
	},

	afterRender: function(){
		var options;
		for(var i = 0; i < this.quantity; i++){
			options = _.extend(
				{id: i+1}, 
				this.details[i+1]
			);
			this.$('tbody').append(this.row(options));
		}
		this.$('[name=accessories]').tagsinput();
	},

	serialize: function(){
		var model = app.storage.collection("models").get(this.model_id);
		if (model && model.attributes){
			return model.attributes;
		}
		return;
	},

	applyFilters: function(e){
		var checkbox, column, $el, tabindex;
		checkbox = this.$(e.target).closest('input');
		column   = checkbox.data('name');
		$el       = (column === 'accessories') ? 
			this.$(".bootstrap-tagsinput input") : this.$("[name="+column+"]");
		$el.attr("disabled", !checkbox.prop('checked'));
	},

	updateDetails: function(e, field){
		var $tr                 = this.$(e.target).closest('tr');
		var id                  = $tr.find('td[name=id]').text();
		this.details[id]        = (this.details[id]) ? this.details[id] : {};
		this.details[id][field] = $tr.find('[name='+field+']').val();
	},

	saveDetails: function(){
		app.modalController.runCallerMethod(this.rowId, this.details);
	},
});