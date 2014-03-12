//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
$(function() {
    $(window).bind("load resize", function() {
        if ($(this).width() < 768) {
        	$('#toggle-sidebar').hide();
            $('div.sidebar-collapse').addClass('collapse')
        } else {
        	$('#toggle-sidebar').show();
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })
})
