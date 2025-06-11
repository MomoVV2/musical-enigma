var stickyNavigation = function() {
    var headerHeight = $('.header-logo-box').outerHeight(),
        scrollTop = 0;

    $(window).on('scroll', function() {
        scrollTop = $(this).scrollTop();

        if (scrollTop > headerHeight) {
            $('.navbar, .header-logo-box').addClass('sticky');
        } else {
            $('.navbar, .header-logo-box').removeClass('sticky');
        }
    });
};