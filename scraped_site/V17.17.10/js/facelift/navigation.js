var navbarSelectorFacelift = '#top-navigation .navbar-nav';
var navigationOverflow = function() {
    var navbarWidth = 0,
        navWidth = 0,
        flyoutItems = 8,
        tmpNav = '<li class="dropdown dropdown-tmp"><button type="button"><i class="fa-regular fa-ellipsis-vertical"></i></button><ul class="dropdown-menu"></ul></li>';

    if (windowDimensions.viewportWidth < breakpoints.md) {
        $('.dropdown-tmp').remove();
        $(navbarSelectorFacelift + ' > li').show();

        return;
    }

    if ($('.dropdown-tmp').length) {
        $('.dropdown-tmp').remove();
    }

    // Simple dropdown on dropdowns with less than 8 items
    $(navbarSelectorFacelift + ' > li.dropdown').each(function() {
        if ($(this).find('.dropdown-menu > li').length < flyoutItems) {
            $(this).addClass('dropdown-slim');
        }
    });

    navbarWidth = $('.navbar-collapse').width();
    $(navbarSelectorFacelift).append(tmpNav);
    $('.dropdown-tmp').hide();

    // Move navigation elements to temporary dropdown if not enough space in navbar
    $(navbarSelectorFacelift + ' > li:not(".dropdown-tmp")').each(function() {
        var that = $(this),
            elementWidth = $(this).width(),
            clone;

        that.show();

        navWidth = navWidth + elementWidth;

        if (navbarWidth < navWidth + 80) {
            $('.dropdown-tmp').show().addClass('dropdown-slim');
            clone = that.clone();
            that.hide();
            $('.dropdown-tmp > .dropdown-menu').append(clone);
            clone.show();
        }
    });

    $('.dropdown-slim .dropdown-slim').removeClass('dropdown-slim');
};

var dropDownAlignment = function() {
    var viewportCenter = $('body').width() / 2;

    $(navbarSelectorFacelift + ' > li.dropdown-slim').each(function() {
        if ($(this).offset().left <= viewportCenter) {
            $(this).addClass('dropdown-slim--left');
        }
    });
};

var mobileNavigation = function() {
    var target = $('.navbar-toggle').data('target'),
        headerHeight = $('.header-logo-box').outerHeight();

    if (windowDimensions.viewportWidth >= breakpoints.md) {
        $(navbarSelectorFacelift + ', .dropdown-menu').attr('style', '');

        return;
    }

    if (!$('.navbar-default.sticky').length) {
        $(navbarSelectorFacelift).css({'padding-top' : headerHeight + 'px' });
    } else {
        $(navbarSelectorFacelift).attr('style', '');
    }

    $(target).on('shown.bs.collapse', function() {
        $('body').css({ 'overflow': 'hidden' });
    });

    $(target).on('hidden.bs.collapse', function() {
        $('body').attr('style', '');
    });

    $('.dropdown').on('show.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(250);
    });

    $('.dropdown').on('hide.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(250);
    });
};

var mobileDropdown = function() {
    if (windowDimensions.viewportWidth >= breakpoints.md) {
        $(navbarSelectorFacelift + ' ul.dropdown-menu a[data-toggle]').remove();
        initMobileDropdown = false;

        return;
    }

    if (!initMobileDropdown) {
        $(navbarSelectorFacelift + ' li.dropdown > a').each(function() {
            $(this).attr('data-toggle', 'dropdown');
            $(this).dropdown();
        });

        $(navbarSelectorFacelift + ' li.dropdown').each(function() {
            var dropdownLink = $(this).clone();

            dropdownLink.find('ul.dropdown-menu').remove();
            dropdownLink.removeClass('dropdown');
            dropdownLink.find('a').attr('data-toggle', '');

            dropdownLink.prependTo($(this).find('ul.dropdown-menu'));
        });

        initMobileDropdown = true;
    }
};
