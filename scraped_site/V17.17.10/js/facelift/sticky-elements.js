var stickyElements = function() {
    var headerHeight = $('.header-logo-box').outerHeight(),
        navHeight = $('.community-facelift.navbar').outerHeight(),
        headerNavHeight = headerHeight + navHeight + 15,
        documentHeight = $(document).outerHeight(),
        windowHeight = $(window).outerHeight(),
        scrollTop = 0;

    $('.sticky-element').each(function(index, item) {
        var stickyElement = $(item).offset().top;

        $(window).on('scroll', function() {
            scrollTop = $(this).scrollTop();

            scrollTop > stickyElement ? $(item).addClass('sticky') : $(item).removeClass('sticky');
        });
    });

    $('.alert.sticky').each(function(index, item) {
        $(item).css({'top': headerNavHeight + 'px'});
        
        $(window).on('scroll', function() {
            scrollTop = $(this).scrollTop();

            scrollTop > headerHeight ? $(item).css({'top': navHeight + 15 + 'px'}) : $(item).css({'top': (headerNavHeight - scrollTop) + 'px'});
        });
    });

    // Explizit sticky behaviour for navigation
    $(window).on('scroll', function() {
        scrollTop = $(this).scrollTop();

        scrollTop > headerHeight ? $('.navbar, .header-logo-box').addClass('sticky') : $('.navbar, .header-logo-box').removeClass('sticky');

        if (windowDimensions.viewportWidth < breakpoints.md) {
            if (scrollTop + windowHeight >= documentHeight - 50) {
                $('.navbar, .header-logo-box').removeClass('sticky');
            }
        }
    });
}