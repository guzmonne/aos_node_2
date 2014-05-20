App.Views.ApplianceMultipleFormView = App.Views.BaseView.extend({
	className: "col-lg-12",
	template: HBS.appliance_multiple_form_template,
	row     : HBS.appliance_multiple_form_row_template,

	events: {
		'click button[name=select-model]'      : 'renderSelectModel',
		'click button[name=remove-row]'        : 'removeRow',
		'click button[name=add-row]'           : 'addRow',
		'click button[name=more-details]'      : 'moreDetails',
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
	},

	initialize: function(){
		this.$tr     = undefined;
		this.details = {};
	},

	afterRender: function(){
		this.newRow();
		this.$el.tooltip();
	},

	selectModel: function(e){
		if(e){e.preventDefault();}
		if (	
			!App.defined(this.modelSelectModalView)								|| 
			!App.defined(this.modelSelectModalView.app))
		{
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
		}
		app.modalController.displayModal(this.modelSelectModalView, this, 'modelSelected');
	},

	activeRow: function(row){
		this.$tr = this.$('tr[data-row='+row+']');
	},

	newRow: function(row){
		row = row ? row : _.uniqueId();
		this.$('tbody').prepend(this.row({row: row}));
	},

	renderSelectModel: function(e){
		e.preventDefault();
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		this.selectModel();
	},

	modelSelected: function(model){
		this.$tr.find('dt[name=brand]'   ).text(model.get('brand'));
		this.$tr.find('dd[name=model]'   ).text(model.get('model'));
		this.$tr.find('dd[name=model_id]').text(model.id);
		this.$tr.find('button[name=select-model]').remove();
		this.$tr.find('div[name=model-edit]').append(
			'<button class="btn btn-warning pull-right" name="select-model">' +
				'<i class="fa fa-desktop fa-fw"></i>'                           +
			'</button>'
		);
	},

	addRow: function(e){
		e.preventDefault();
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		if (this.$tr.find('dd[name=model_id]').text() === ''){return;}
		this.$tr.find('button.btn-controls').toggleClass('hide');
		this.newRow();
	},

	removeRow: function(e){
		e.preventDefault(e);
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		if(confirm('Esta seguro que desea elminar esta fila?')){
			this.$tr.remove();
		}
	},

	moreDetails: function(e){
		e.preventDefault(e);
		var options, rowId = this.$(e.target).closest('tr').data("row");
		this.activeRow(rowId);
		options = {
			rowId   : rowId,
			quantity: parseInt(this.$tr.find('input[name=quantity]').val()),
			details : this.details[rowId],
			model_id: this.$tr.find('dd[name=model_id]').text()
		};
		view = new App.Views.ApplianceMultipleFormDetailsModalView(options);
		app.modalController.displayModal(view, this, 'detailsUpdated');
	},

	detailsUpdated: function(id, details){
		this.details[id] = (this.details[id]) ? this.details[id] : {}; 
		this.details[id] = details;
		this.$tr.find('button[name=more-details]').removeClass('btn-success').addClass('btn-warning');
	},
});