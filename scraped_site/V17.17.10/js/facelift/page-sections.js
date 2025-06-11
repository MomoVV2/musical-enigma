var pageSections = function() {
    var hideSections;

    var checkScroll = function() {
        hideSections = setTimeout(function() {
            $('.page-sections a').removeClass('active');
        }, 2000);
    };
    
    var resetCheckScroll = function() {
        clearTimeout(hideSections);
    };

    var setPageSections = function(element) {
        // remove sections for ajax calls
        $('nav.page-sections').remove();
        
        var dom = '<nav class="page-sections"></nav>',
            viewportHeight = $(window).height() / 2,
            pageSections = [];
        
        if (!$('a[name]').length || $('a[name]').length <= 1 || $('.page-sections').length) {
            return;
        }
        
        $('body').append(dom);

        $(element).each(function() {
            var section = $(this).attr('name');
            
            $('.page-sections').append('<a href="#' + section + '"><span>' + section + '</span></a>');
        });
        
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop() + viewportHeight;
            
            $(element).each(function(index, element) {
                var isVisible = $(element).position().top,
                    pageSectionName = $(element).attr('name');
                
                if (isVisible < scrollTop) {
                    if (pageSections.indexOf(pageSectionName) > -1) {
                        pageSections = [];
                    }
                    
                    pageSections.push(pageSectionName);
                    
                    setTimeout(function() {
                        $('.page-sections a').removeClass('active');
                        $('.page-sections a[href="#' + pageSections[pageSections.length - 1] + '"]').addClass('active');
                    }, 100);
                }
            });
            
            resetCheckScroll();
            checkScroll();
        });
    };

    if ($('.tab-pane a[name]').length) {
        setPageSections($('.tab-pane.active').find('a[name]'));

        $('[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            $('nav.page-sections').remove();
            setPageSections($('.tab-pane.active').find('a[name]'));
        });

        return;
    }
    
    setPageSections('a[name]');

    
};
