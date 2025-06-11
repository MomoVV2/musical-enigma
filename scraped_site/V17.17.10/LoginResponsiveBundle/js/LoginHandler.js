/**
 * @author jh
 * @class
 */
var LoginHandler = Class.extend({

    /**
     * @type {jQuery}
     */
    jQuery: null,

    /**
     * @author jh
     * @param {jQuery} jQuery
     * @constructs
     */
    init: function (jQuery) {
        this.jQuery = jQuery;
        var that = this;
        this.jQuery('#submit-button').on('click', this.submitUserCredentials.bind(this));
        this.jQuery('#username-form, #password-form').keypress(function (e) {
            if (e.which === 13) {
                that.submitUserCredentials();
            }
        });

        $(function () {
            if ($('#login-referer')[0] !== 'undefined' &&
                $('#login-referer')[0].value !== "" &&
                $('#login-referer')[0].value !== "/?" &&
                $('#login-referer')[0].value !== "/" &&
                $('#sso-submit-button').parent().children().length === 1
            ) {
                window.location.href = $('#sso-submit-button').attr("href");
            }
        });

    },

    /**
     * @author jh
     * @param {string} responseText
     * @return {void}
     */
    showErrorInvalidCredentials: function (responseText) {
        this.jQuery('#username-form, #password-form').addClass('is-invalid');
        this.jQuery('#username-input, #password-input').blur();
        this.jQuery('#wrong-credentials-message p').text(responseText);
        this.jQuery('#wrong-credentials-message').removeClass('hidden');
    },


    /**
     * @author jh
     * @return {void}
     */
    resetFormsAndErrorMessage: function () {
        this.jQuery('#username-form, #password-form').removeClass('is-invalid');
        this.jQuery('#wrong-credentials-message').addClass('hidden');
    },

    /**
     * @author jh
     * @return {void}
     */
    submitUserCredentials: function () {
        let that = this;
        let simoLoadingSpinner = this.jQuery('.simo-loading-spinner');
        let domainId = this.jQuery('#domain-id').val();
        let pageId = this.jQuery('#page-id').val();
        let username = this.jQuery('#username-input').val();
        let password = this.jQuery('#password-input').val();
        let permanentLoginCheckbox = document.getElementById('permanent-login');
        let permanentLogin = 0;
        if (permanentLoginCheckbox && permanentLoginCheckbox.checked) {
            permanentLogin = 1;
        }

        simoLoadingSpinner.removeClass('hidden');
        this.resetFormsAndErrorMessage();

        this.jQuery.ajax({
            url: '/ajax/' + pageId + '/LoginResponsive/LoginHandler',
            type: 'POST',
            data: {
                'domain-id': domainId,
                'password': password,
                'username': username,
                'permanent-login': permanentLogin
            },
            success: that.handleSuccessAfterSubmit.bind(that),
            error: function (response) {
                simoLoadingSpinner.addClass('hidden');
                if (response.status === 403 || response.status === 400) {
                    that.showErrorInvalidCredentials(response.responseText);
                } else {
                    that.jQuery('#simo-error-modal').modal('show');
                }
            },
        });
    },

    /**
     * @author jh
     * @return {void}
     */
    handleSuccessAfterSubmit: function () {
        var redirectToSpecificPage = this.getLoginReferrer();
        var homeResponsiveBundleUrl = this.jQuery('#home-responsive-bundle-url').val();
        if ($('#login-referer')[0] !== 'undefined' && $('#login-referer')[0].value !== "") {
            window.location.href = $('#login-referer')[0].value;
            return;
        }
        if (redirectToSpecificPage == null) {
            if (homeResponsiveBundleUrl === '') {
                location.reload();
            } else {
                window.location.href = homeResponsiveBundleUrl;
            }
        } else {
            window.location.href = encodeURI(redirectToSpecificPage);
        }
    },

    /**
     * @author jh
     * @return {string|null}
     */
    getLoginReferrer: function () {
        var url = new URL(window.location.href);
        return url.searchParams.get('loginReferrer');
    }
});

new LoginHandler(jQuery);
