var pageScroll = function() {
    var navHeight = $('.navbar').outerHeight();

    $('a[href*="#"]').on('click', function(e) {
        var href = $(this).attr('href').replace('#', '');

        if (!$('a[name="' + href + '"]').length) {
            return;
        }

        e.preventDefault();

        $('html, body').animate({ scrollTop: $('a[name="' + href + '"]').offset().top - navHeight - 10 }, 'swing');
    });

    $('.scroll-up').on('click', function(e) {
        e.preventDefault();

        $('html, body').animate({ scrollTop: 0 }, 'swing');
    });
};