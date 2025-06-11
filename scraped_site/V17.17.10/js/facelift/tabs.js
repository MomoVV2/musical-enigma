var dropdownTabs = function() {
    $('.dropdown-menu[aria-role="tablist"] a').on('click', function(e) {
        e.preventDefault();

        $(this).tab('show');

        $('.dropdown-menu[aria-role="tablist"] li').removeClass('active');
        $(this).parent().addClass('active');
    });
};

var switchTab = function() {
    $('[data-switch]').on('click', function() {
        var target = $(this).data('switch');

        $('[data-switch-target]').removeClass('active');
        $('[data-switch-target="' + target + '"]').addClass('active');
    });
};

var activeTab = function() {
    $('.tab-pane.active').each(function(index, item) {
        var id = $(item).attr('id');

        $('#' + id).addClass('active');
    });

    $('a[data-toggle="tab"], button[data-toggle="tab"]').on('show.bs.tab', function(e) {
        var href = $(e.target).attr('href');
        
        $('a[data-toggle="tab"], button[data-toggle="tab"]').removeClass('active');
        $('a[data-toggle="tab"], button[data-toggle="tab"]').parents('li').removeClass('active');

        $('a[href="' + href + '"]').addClass('active');
        $('a[href="' + href + '"]').parents('li').addClass('active');
    });
};
var kurseFastAccess = function() {
    $('.kurse__fast-access > button').on('click', function() {
        var button = $(this);

        button.attr('disabled', true);

        $('.kurse__fast-access > .kurse__fast-access__content').slideToggle('fast', function() {
            button.attr('disabled', false);
        });
    });
};
