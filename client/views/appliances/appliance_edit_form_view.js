App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template, 

	className: "row",

	afterRender: function(){
		App.animate(this.$el, this.animation);
		this.$('[name=accessories]').tagsinput();
		$('#myCarousel.slide').carousel({
      interval: 0,
      pause: "hover"
    });
	},

	serialize: function(){
		return {
			appliances: this.collection.toJSON()
		};
	},
});