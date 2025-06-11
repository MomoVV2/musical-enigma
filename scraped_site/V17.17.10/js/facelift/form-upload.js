var defaultFileUpload = function() {
    $('.form__upload-default').each(function() {
        var input = $(this).find('input[type="file"]');
        var remove = $(this).find('button.form__upload-remove');
        var text = $(this).find('input[type="file"] + span.form__upload-text');
        var textDefault = text.html();

        input.on('change', function(e) {
            var file = e.currentTarget.files[0];

            if (!file) {
                return;
            }

            $(remove).attr('disabled', false);
            $(remove).addClass('in');

            text.text(file.name);
        });

        remove.on('click', function() {
            if (!input[0].value) {
                return;
            }

            input[0].value = '';

            $(this).attr('disabled', true);
            $(this).removeClass('in');

            text.html(textDefault);
        });
    });
};
