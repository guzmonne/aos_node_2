App.Views.SideNavView = App.Views.BaseView.extend({
	template: HBS.side_nav_template,

	tagName: 'nav',
	attributes: function(){
		return {
			'class': 'navbar-inverse navbar-static-side',
			'role' : 'navigation',
		};
	},

	events: {
		'click ul#side-menu li a'       : 'activateLi',
		'click ul.nav-second-level li a': 'activateSecondLi',
		'click a'                       : function(e){e.preventDefault();},
	},

	afterRender: function(){
    this.$('#side-menu').metisMenu();
    this.searchView = new App.Views.SearchView();
    this.searchView.attachTo('ul#side-menu li.sidebar-search');
	},

	activateLi: function(e){
		this.$('ul#side-menu li a').removeClass('active');
		this.$(e.currentTarget).closest('a').addClass('active');
	},

	activateSecondLi: function(e){
		console.log(e);
		this.$('ul.nav-second-level li a').removeClass('second-level-active');
		this.$(e.currentTarget).closest('a').addClass('second-level-active');
	},
});