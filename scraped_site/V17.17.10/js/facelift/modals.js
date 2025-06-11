var messagesReply = function(modal) {
    if ($('.modal .messages__reply').length) {
        var initWidth = $(window).width();
        var resizeWidth = 0;

        var messagesReplyHeight = function(scrollTop) {
            $('.messages__reply').css({
                'top': scrollTop + $(window).height() - $('.messages__reply').outerHeight() + 'px',
                'bottom': 'auto'
            });
        };

        var messagesReplyScroll = function(modal) {
            var scrollTop = modal.scrollTop();

            messagesReplyHeight(scrollTop);

            $('.messages__reply textarea').on('focus blur', function() {
                messagesReplyHeight(scrollTop);
            });
        };

        var messageUploadsToggle = function() {
            $('.messages__reply .btn-icon.paperclip').on('click', function() {
                if ($('.uploaded-file-preview').hasClass('in')) {
                    return;
                }

                $('.uploaded-file-preview').addClass('in');

                messagesReplyScroll($(modal));
            });

            $('.uploaded-file-preview > button').on('click', function() {
                $('.uploaded-file-preview').removeClass('in');
                messagesReplyScroll($(modal));
            });
        };

        messageUploadsToggle();

        $(modal).on('scroll', function() {
            messagesReplyScroll($(this));
        });

        $(window).on('resize', function() {
            resizeWidth = $(window).width();

            if (initWidth === resizeWidth) {
                return;
            }

            if (resizeWidth !== initWidth) {
                messagesReplyScroll($(modal));

                initWidth = resizeWidth;
            }
        });
    }
};

var closeModals = function() {
    $('.modal').on('shown.bs.modal', function() {
        var activeModal = $(this);

        $(document).on('keyup', function(e) {
            e.key === 'Escape' && activeModal.modal('hide');
        });
    });

    $('.modal').on('hidden.bs.modal', function() {
        $(document).off('keyup');
    });

    $('a[data-toggle="remote-modal"]').on('click', function(e) {
        if (windowDimensions.viewportWidth > breakpoints.md - 1) {
            return;
        }

        e.preventDefault();

        var modalAction = $(this).data('action'),
            request = e.currentTarget.href + ' #message__thread',
            defaultContent = '<div class="modal update fade" id="dialog-dialog-edit" role="dialog">\
                                <div class="modal-dialog">\
                                    <div class="modal-content">\
                                        <div class="modal-header alternate">\
                                            <h2 class="modal-title" id="myModalLabel">Nachricht</h2>\
                                            <button type="button" data-dismiss="modal" class="btn btn-circle" aria-hidden="true"><i class="fa-regular fa-xmark"></i></button>\
                                        </div>\
                                        <div class="modal-body preloader"></div>\
                                    </div>\
                                </div>\
                            </div>',
            newMessageTitle = 'Neue Nachricht',
            errorContent = '<div class="alert alert-warning" role="alert">\
                                <div class="alert__icon"></div>\
                                <strong>Hinweis</strong><br />Der angeforderte Inhalt konnte leider nicht geladen werden.<br />Bitte versuchen Sie es erneut.\
                            </div>';

        if ($('#modalHolder').length) {
            $('#modalHolder').remove();
        }

        $(this).after('<div id="modalHolder"></div>');

        $('#modalHolder').html(defaultContent);

        $('#modalHolder .modal-body').html(errorContent);

        if (typeof modalAction !== 'undefined' && modalAction === 'new-message') {
            $('#modalHolder .modal').addClass('new-message');
            $('#modalHolder .modal-header').removeClass('alternate');
            $('#modalHolder .modal-header h2').html(newMessageTitle);
        }

        $('#modalHolder .modal-body').load(request, function(data, status) {
            $('#modalHolder .modal-body').removeClass('preloader');
            messagesReply($('#modalHolder .modal'));

            $('.messages__header h4').html('');
            $('.messages__recipients').css('display', 'none');

            if (status !== 'success') {
                $('#modalHolder .modal-body').html(errorContent);
            } else {
                $('#modalHolder .modal-body').html($(data).find('#messages'));

                $.getScript('https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.1/min/dropzone.min.js', function(data, status) {
                    if (status === 'success') {
                        dropzoneSettings();
                    }
                });

                $.getScript('/js/jquery/plugins/jquery.autoSuggest.js', function(data, status) {
                    if (status === 'success') {
                        $('<link>')
                            .appendTo($('#modalHolder'))
                            .attr({type : 'text/css', rel : 'stylesheet'})
                            .attr('href', '/styles/autosuggest.css');

                        $("#recipientAuto").autoSuggest('', {
                            minChars: 2,
                            startText: "",
                            asHtmlID: 'recipients',
                            emptyText: "empty",
                            selectedItemProp: "name",
                            searchObjProps: "name",
                            matchCase: false,
                            queryParam: 'term',
                            neverSubmit: true,
                            retrieveLimit: 6,
                            resultsHighlight: true,
                            extraParams: '&action=fetchRecipients',
                            formatList: function (data, elem) {
                                var profileImg = data.image;
                                var profileName = data.name;
                                var auto = elem.html(
                                    '<div class="FloatLeft AutosuggestName"><img src="' + profileImg + '" style="height:30px;"/>&nbsp;' + profileName + '</div>'
                                );
                                return auto;
                            }
                        });

                        $('#textarea').focus();
                    }
                });
            }
        });

        $('#modalHolder .modal').modal();
    });
};
