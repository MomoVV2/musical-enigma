var windowDimensions = {
    viewportWidth: $(window).width(),
    viewportHeight: $(window).height()
};

$(window).on('resize', function() {
    windowDimensions = {
        viewportWidth: $(window).width(),
        viewportHeight: $(window).height()
    };
});

var breakpoints = {
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 500,
    xs: 375
};

var isTouch = function() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
};

var getScrollbarWidth = function() {
    return window.innerWidth - document.documentElement.clientWidth;
};