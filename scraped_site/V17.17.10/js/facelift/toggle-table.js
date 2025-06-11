var toggleTable = function(table) {
    var colTreshold = 0,
        context = [],
        headCols = table.find('thead tr').children('td'),
        toggleCols = table.data('toggle-cols-mobile');
        table.find('[data-toggle="tooltip"]').tooltip('destroy');
    let cloneTable = table.clone(true);
        cloneTable.find('[data-toggle="tooltip"]').tooltip();

    if (windowDimensions.viewportWidth > breakpoints.lg) {
        toggleCols = table.data('toggle-cols');
    }

    if (windowDimensions.viewportWidth < breakpoints.lg && windowDimensions.viewportWidth > breakpoints.sm) {
        toggleCols = table.data('toggle-cols-tablet');
    }

    if (typeof toggleCols !== 'undefined' && toggleCols !== '') {
        cloneTable.addClass('table-update--toggle');

        cloneTable.find('thead tr td').each(function() {
            context.push($(this).text().trim());
        });
    }

    table.removeClass('loaded');

    cloneTable.find('tr').each(function(index, tr) {
        var tableBody = $(this).parents('tbody').length,
            tableFoot = $(this).parents('tfoot').length,
            tableId = '';

        if (typeof toggleCols === 'undefined' || toggleCols === '') {
            return;
        }

		colTreshold = 0;
		for (var i = 0; i < headCols.length; i++) {
			var currentTd = headCols[i];
			var currentColumn = $(currentTd).data('column');

			if (true === toggleCols.includes(currentColumn)) {
				colTreshold++;
			}
		}
		colTreshold = headCols.length - colTreshold;

        if (tableBody) {
            $(tr).after('<tr class="toggle"><td colspan="' + (colTreshold + 1) + '"><div class="slide"><table><tr></tr></table></div></td></tr>');
        }

        if (tableFoot) {
            $(tr).find('> td').attr('colspan', colTreshold + 2);

            return;
        }

        $(tr).find('> td').each(function(index, item) {
            if (typeof $(item).data('column') !== 'undefined') {
                tableId = $(item).data('column');
            } else {
                tableId = index + 1;
            }

            if (isTouch()) {
                if (tableBody) {
                    if (context[index] !== '') {
                        $(item).attr('data-context', context[index]);
                    }

                    $(tr).next().find('table tr').append($(item).clone(true));
                }
            }

            for (var i = 0; i < toggleCols.length; i++) {
                if (tableId === toggleCols[i]) {
                    if (!isTouch()) {
                        if (tableBody) {
                            if (context[index] !== '') {
                                $(item).attr('data-context', context[index]);
                            }

                            $(tr).next().find('table tr').append($(item).clone(true));
                        }
                    }

                    $(item).hide();
                }
            }
        });

        $(tr).append('<td class="toggle"></td>');

        $(tr).find('a, button').on('click', function(e) {
            e.stopPropagation();

            return;
        });

        $(tr).on('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                return;
            }

            let noToggleTarget = e.target.classList.contains('simo-no-toggle');
            if (noToggleTarget) {
                return;
            }

            var toggle = $(this).next('tr.toggle'),
                trigger = $(this);
                isVisible = 0;

            if (!isVisible) {
                toggle.css({'display': 'table-row'});
                trigger.addClass('in');
            }

            toggle.find('.slide').slideToggle(250, function() {
                isVisible = toggle.find('.slide:hidden').length;

                if (isVisible) {
                    toggle.hide();
                    trigger.removeClass('in');
                }
            });
        });


    });

    table.before(cloneTable);

    cloneTable.addClass('cloned').show();

    stripTable(cloneTable);

    table.hide();
};


var stripTable = function(table) {
    var contentLength = 0,
        contentChilds = '',
        headColContents = [],
        headColWidths = [],
        popupTrigger = isTouch() ? 'manual' : 'hover',
        stripText = '',
        stripTextLength = 0,
        stripTreshold = 10;

    table.find('thead tr td:visible').each(function(index, th) {
		headColContents.push($(th).text().trim());
        headColWidths.push($(th).outerWidth());
    });

    table.find('tbody tr:visible').each(function(index, tr) {
        $(tr).find('> td:visible').each(function(index, td) {
            if ($(td).children('a').length) {
                contentLength = $(td).children('a').text().replace(/(\t|\t)/gm, '').trim().length;
                contentChilds = 'a';
            } else if ($(td).children('h3').length) {
                contentLength = $(td).children('h3').text().replace(/(\t|\t)/gm, '').trim().length;
                contentChilds = 'h3';
            } else {
                contentLength = $(td).text().replace(/(\t|\t)/gm, '').trim().length;
                contentChilds = '';
            }
            if (headColContents[index].replace(/\s/g, "").trim().length > contentLength) {
                return;
            }

            if (headColWidths[index] / contentLength > stripTreshold) {
                return;
            }

            stripTextLength = Math.round((headColWidths[index]) / stripTreshold);

            if ($(td).attr('data-ignore-trim')) {
                return;
            }

            $(td).attr('data-content', $(td).html());
            $(td).attr('data-toggle', 'popover');

            $(td).popover({
                trigger: popupTrigger,
                container: 'body',
                placement: 'bottom',
                html: 'true',
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
            });

            td.addEventListener('touchstart', function() {
                $(this).popover('show');
            }, {passive: true});

            $(td).on('touchend', function() {
                $(this).popover('hide');
            });

            if (contentChilds !== '' && typeof contentChilds !== 'undefined') {
                stripText = $(td).children(contentChilds).html().trim().substring(0, stripTextLength);
                $(td).children(contentChilds).html(stripText + '...');
            } else {
                stripText = $(td).text().trim().substring(0, stripTextLength);
                $(td).html(stripText + '...');
            }
        });
    });

    table.addClass('loaded');
};

var initStripTable = function() {
    $('.table-update:visible').each(function() {
        if ($(this).hasClass('pruefungsergebnisse__legend') || $(this).hasClass('table-info--simple')) {
            $(this).addClass('loaded');

            return;
        }

        if ($(this).hasClass('loaded')) {
            return;
        }

        stripTable($(this));
    });
};

var toggleTableRefresh = function() {
    var initWidth = $(window).width();
    var resizeWidth = 0;

    $(window).on('resize', function() {
        resizeWidth = $(window).width();

        if (initWidth === resizeWidth) {
            return;
        }

        $('.table-update').each(function() {
            $(this).removeClass('loaded');
        });

        $('.table-update').each(function() {
            if ($(this).hasClass('cloned')) {
                $(this).remove();
            }

            $(this).show();
        });

        if (resizeWidth !== initWidth) {
            $('.table-update:visible').each(function() {
                if ($(this).hasClass('pruefungsergebnisse__legend') || $(this).hasClass('table-info--simple')) {
                    $(this).addClass('loaded');

                    return;
                }

                if ($(this).hasClass('loaded')) {
                    return;
                }

                toggleTable($(this));
            });

            initWidth = resizeWidth;
        }
    });
};

// is needed so that the table can be initialized manually (e.g. on ajax reloads)
var initializeTableOnLoad = function() {
    $('.table-update:visible').each(function() {
        if ($(this).hasClass('pruefungsergebnisse__legend') || $(this).hasClass('table-info--simple')) {
            $(this).addClass('loaded');

            return;
        }

        if ($(this).hasClass('loaded')) {
            return;
        }

        toggleTable($(this));
    });

    $('[data-toggle="tab"]').on('shown.bs.tab', function() {
        $('.table-update:visible').each(function() {
            if ($(this).hasClass('pruefungsergebnisse__legend') || $(this).hasClass('table-info--simple')) {
                $(this).addClass('loaded');

                return;
            }

            if ($(this).hasClass('loaded')) {
                return;
            }

            toggleTable($(this));
        });
    });

    $('.collapse').on('shown.bs.collapse', function() {
        $('.table-update:visible').each(function() {
            if ($(this).hasClass('pruefungsergebnisse__legend') || $(this).hasClass('table-info--simple')) {
                $(this).addClass('loaded');

                return;
            }

            if ($(this).hasClass('loaded')) {
                return;
            }

            toggleTable($(this));
        });
    });

    if ($('.table-update').length) {
        toggleTableRefresh();
    }

    $('.ajax-update-table-filter-form').trigger('initialize-events');
};

if ($('.table-update').length) {
	initializeTableOnLoad();
}
