var infopool = function() {
    var folderCount = $('.infopool__toolbar .btn-breadcrumb > a').length,
        characterTreshold = 10,
        folderTexts = [],
        trimmedText = '',
        initWidth = $(window).width(),
        resizeWidth = 0;
    
    var trimText = function(index, item) {
        if (index < folderCount - 2) {
            $(item).text('...');
        }

        if ($('.infopool__toolbar .btn-breadcrumb').width() / $(item).html().length < characterTreshold) {
            trimmedText = $(item).html().substring(0, Math.round($('.infopool__toolbar .btn-breadcrumb').width() / characterTreshold));

            $(item).html(trimmedText + '...');
        }
    };

    $('.infopool__toolbar .btn-breadcrumb > a').each(function(index, item) {
        folderTexts.push($(item).html());

        trimText(index, item);
    });

    $('.infopool__toolbar .btn-breadcrumb').addClass('in');

    $(window).on('resize', function() {
        resizeWidth = $(window).width();

        if (initWidth === resizeWidth) {
            return;
        }

        if (resizeWidth !== initWidth) {
            $('.infopool__toolbar .btn-breadcrumb').removeClass('in');

            $('.infopool__toolbar .btn-breadcrumb > a').each(function(index, item) {
                $(item).text(folderTexts[index]);

                trimText(index, item);
            });

            $('.infopool__toolbar .btn-breadcrumb').addClass('in');

            initWidth = resizeWidth;
        }
    });
};