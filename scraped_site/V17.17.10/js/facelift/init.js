/* requires:
    ./plugins/jquery.touchmove.min.js
    helper.js
    dropzone.js
    modals.js
    navigation.js
    sticky-elements.js
    page-sections.js
    page-scroll.js
    carousels.js
    charts.js
    infopool.js
    toggle-table.js
    tabs.js
    form.js
*/

var initMobileDropdown = false;
var initFaceliftContent = function() {
    isTouch() && $('body').addClass('is-touch');

    if (windowDimensions.viewportWidth >= breakpoints.md) {
        navigationOverflow();
        dropDownAlignment();
    }

    if (windowDimensions.viewportWidth >= breakpoints.lg) {
        $('[data-toggle="popover"]').popover({
            trigger: 'hover',
            container: 'body',
            placement: 'bottom',
            html: 'true',
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
        });
    }

    var tooltipTrigger = isTouch() ? 'manual' : 'hover';

    $('[data-toggle="tooltip"]').tooltip({
        trigger: tooltipTrigger,
        container: 'body',
        html: 'true'
    });

    $('[data-toggle="tooltip"]').on('touchstart', function() {
        $(this).tooltip('show');
    });

    $('[data-toggle="tooltip"]').on('touchend', function() {
        $(this).tooltip('hide');
    });

    $('[data-toggle="popover-table"]').popover({
        trigger: 'hover',
        placement: 'top',
        container: 'body',
        html: 'true'
    });

    $('[data-toggle="popover-news"]').popover({
        trigger: 'hover',
        container: 'body',
        placement: 'bottom',
        html: 'true',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
    });

    $('.modal').on('show.bs.modal', function() {
        $('#top-navigation.community-facelift.navbar-default.sticky').css({'padding-right': getScrollbarWidth() + 'px'});
    });

    $('.modal').on('hidden.bs.modal', function() {
        $('#top-navigation.community-facelift.navbar-default.sticky').removeAttr('style');
    });

    if (windowDimensions.viewportWidth < breakpoints.md) {
        $('button.navbar-toggle').on('click', function() {
            mobileNavigation();
        });

        mobileDropdown();
    }

    stickyElements();
    pageSections();
    pageScroll();
    initCharts();
    carousels();
    dropdownTabs();
    switchTab();
    activeTab();
    kurseFastAccess();
    fileUpload();
    defaultFileUpload();
    closeModals();
    infopool();

    $('[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        pageScroll();
    });

    $(window).on('resize', function() {
        setTimeout(function() {
            navigationOverflow();
            mobileDropdown();
            mobileNavigation();
            dropDownAlignment();
        }, 100);
    });
};
