var carousels = function() {
    // Add touch support to Bootstrap carousel
    $('.carousel').each(function() {
        $(this).swipe({
            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
                if (direction === 'left') $(this).carousel('next');
                if (direction === 'right') $(this).carousel('prev');
            },
            allowPageScroll: "vertical"
        });

        $(this).carousel({interval: false});
    });
};