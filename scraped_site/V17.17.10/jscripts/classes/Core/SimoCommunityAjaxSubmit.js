/**
 * @author tp
 */
var SimoCommunityAjaxSubmit = Class.extend({

    /**
     * @author tp
     * @return {void}
     */
    init: function () {
        var that = this;
        that.isPwa = Boolean(document.querySelector('body').getAttribute('data-is-pwa'));

        var submitButton = $('.simo-community-ajax-submit');

        submitButton.off('click');
        submitButton.on('click', function (event) {
            event.preventDefault();

            var button = $(this);
            if (button.attr('disabled') || button.hasClass('disabled')) {
                return;
            }

            var formId = button.data('form-id');
            var form = $('#' + formId);
            var action = form.attr('action');
            var simoLoadingSpinner = $('.simo-loading-spinner');
            var redirectUrl = button.data('success-redirect-url');
            var successEventName = button.data('success-event-name');

            if (!formId) {
                throw 'Parameter form-id is required!';
            }
            if (form.length === 0) {
                throw 'Form not found for form-id: ' + formId + '!';
            }
            if (!redirectUrl) {
                redirectUrl = window.location.href;
            }
            if (!action) {
                throw 'Form action is required!';
            }

            simoLoadingSpinner.removeClass('hidden');
            $.ajax({
                type: 'POST',
                url: action,
                data: form.serialize(),
                success: function (responseData, responseType, response) {
                    if (parseInt(response.status) === 204 || parseInt(response.status) === 200) {
                        if (responseData && typeof responseData.redirectUrl !== 'undefined') {
                            window.location = responseData.redirectUrl;
                        } else if (successEventName) {
                            button.trigger(successEventName, responseData);
                            simoLoadingSpinner.addClass('hidden');
                        } else {
                            window.location = redirectUrl;
                        }
                    } else {
                        simoLoadingSpinner.addClass('hidden');
                        that.showErrorModal();
                    }
                },
                error: function (result) {
                    simoLoadingSpinner.addClass('hidden');
                    if (result.status === 401) {
                        location.replace('/');
                        return;
                    }
                    // noinspection EqualityComparisonWithCoercionJS
                    if (result.status != 400) {
                        that.showErrorModal();
                        return;
                    }
                    try {
                        var validationResult = JSON.parse(result.responseText);
                    } catch (e) {
                        validationResult = result.responseText;
                    }
                    if (validationResult.hasOwnProperty('error')) {
                        that.showErrorModal();
                    }
                    that.showValidationErrors(form, validationResult);
                }
            });
        });
    },

    /**
     * @author ht
     * @param {jQuery} form
     * @param {object} validationResult
     * @return void
     */
    showValidationErrors: function (form, validationResult) {
        var formGroups = form.find('.form-group');
        let invalidClass = 'has-error';
        let validClass = 'has-success';
        if (this.isPwa) {
            invalidClass = 'is-invalid';
            validClass = 'is-valid';
        }
        formGroups.removeClass(invalidClass);
        formGroups.removeClass(validClass);
        $('.validation-note').remove();
        $('.form__error').remove();
        for (var fieldName in validationResult) {
            var searchString = '[name="' + fieldName + '"], [name="' + fieldName + '[]"]';
            if (fieldName.indexOf('[') > -1 && fieldName.indexOf(']') > -1) {
                searchString = '[name="' + fieldName + '"]';
            }
            var field = form.find(searchString);
            field.closest('.form-group').addClass(invalidClass);
            var containerElement = field.closest('div');
            if (containerElement.hasClass('input-group')) {
                containerElement = containerElement.parent('div');
            }
            if (this.isPwa) {
                containerElement.append('<div class="form__error"><p>' + validationResult[fieldName] + '</p></div>');
            } else {
                containerElement.append('<p class="help-block validation-note">' + validationResult[fieldName] + '</p>');
            }
        }
        form.find('.form-group:not(.' + invalidClass + ')').addClass(validClass);
    },

    /**
     * @author ht
     * @return void
     */
    showErrorModal: function () {
        var modal = $('#simo-error-modal');
        var defaultModal = $('#defaultModal');
        var zIndex = 2000;
        if (defaultModal.length === 1) {
            var defaultModalZIndex = defaultModal.css('zIndex');
            if (defaultModalZIndex > 0) {
                zIndex = defaultModalZIndex + 1;
            }
        }
        modal.css('zIndex', zIndex);
        modal.modal('show');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    new SimoCommunityAjaxSubmit();
});

