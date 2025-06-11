/**
 * @author CC
 */
var ProfilePasswordValidator = Class.extend({

    /**
     * @private
     * @instance
     * @type {int}
     */
    ENTROPY_DIGITS: 10,

    /**
     * @private
     * @instance
     * @type {int}
     */
    ENTROPY_INSENSITIVE: 26,

    /**
     * @private
     * @instance
     * @type {int}
     */
    ENTROPY_SENSITIVE: 52,

    /**
     * @private
     * @instance
     * @type {int}
     */
    ENTROPY_SPECIAL_CHARACTERS: 32,

    /**
     * Constructor.
     *
     * @author CC
     */
    init : function() {
        var that = this;
		jQuery('.simo-warning').hide();
		jQuery.each(jQuery('.simo-password-validator').find('.new-password'), function (index, element) {
            jQuery(element).keyup(function(e) {
                var inputField = e.currentTarget.name;
                var inputContent = e.currentTarget.value;

                if (inputField == 'password_old' || inputField == 'password_new_repeat') {
                    return;
                }

                var result = passwordValidator.validate(inputContent);
                that.validatePasswordContent(e, result);
                that.validatePasswordStrength(inputContent.length, result);
            });
        })
    },

    /**
     * @author CC
     * @public
     */
    validate : function(password) {
        var that = this;

        var result = that.notAllCharacterRulesApplied(password);
        result.hasWhitespace = that.hasWhitespace(password);
        result.hasNotEnoughCharacters = that.hasNotEnoughCharacters(password);

        result.isValid = false;
        if(result.hasSpecialCharacters && result.hasDigits && result.hasLowercase && result.hasUppercase
            && ! result.hasNotEnoughCharacters && ! result.hasWhitespace) {
            result.isValid = true;
        }
        
        return result;
    },

    /**
     * @author CC
     * @private
     */
    hasWhitespace : function(password) {
        if (password.match(/\s/)) {
           return true;
        }
        return false;
    },

    /**
     * @author CC
     * @private
     */
    hasNotEnoughCharacters : function(password) {
        return password.length < 8;
    },
    
    /**
     * @author CC
     * @private
     */
    notAllCharacterRulesApplied : function(password) {
        var hasDigits = password.match(/\d{1,}/);
        var hasDigitsResult = true;
        if (hasDigits === null) {
            hasDigitsResult = false;
        }

        var hasSpecialCharacters = password.match(/\W+/);
        var hasSpecialCharactersResult = true;
        if (hasSpecialCharacters === null) {
            hasSpecialCharactersResult = false;
        }

        var hasLowercase = password.match(/[a-z]/);
        var hasLowercaseResult = true;
        if (hasLowercase === null) {
            hasLowercaseResult = false;
        }

        var hasUppercase = password.match(/[A-Z]/);
        var hasUppercaseResult = true;
        if (hasUppercase === null) {
            hasUppercaseResult = false;
        }

        return {
            hasDigits: hasDigitsResult,
            hasSpecialCharacters: hasSpecialCharactersResult,
            hasLowercase: hasLowercaseResult,
            hasUppercase: hasUppercaseResult
        };
    },

    /**
     * @author CC
     * @private
     */
    calculateEntropy: function(validationResult) {
        var entropy = 0;
        if (validationResult.hasDigits == true) {
            entropy += this.ENTROPY_DIGITS;
        }

        if (validationResult.hasLowercase == true && validationResult.hasUppercase == true) {
            entropy += this.ENTROPY_SENSITIVE;
        }
        else if (validationResult.hasLowercase == true) {
            entropy += this.ENTROPY_INSENSITIVE;
        }
        else if (validationResult.hasUppercase == true) {
            entropy += this.ENTROPY_INSENSITIVE;
        }

        if (validationResult.hasSpecialCharacters == true) {
            entropy += this.ENTROPY_SPECIAL_CHARACTERS;
        }
        return entropy;
    },

    /**
     * @author CC
     * @private
     */
    validatePasswordContent: function(e, result) {
        if (result.isValid) {
            jQuery('.help-block').hide();
            jQuery('.simo-warning').hide();
            jQuery(e.currentTarget).parent().parent().removeClass('has-error');
        } else {
            jQuery(e.currentTarget).parent().parent().addClass('has-error');
            jQuery('#simo-rules-js').show();
            jQuery('.simo-warning').show();
        }
    },

    /**
     * @author CC
     * @private
     */
    validatePasswordStrength: function(inputLength, validationResult) {
        var MIN_STRENGTH = 48;
        var GOOD_STRENGTH = 64;
        var VERY_GOOD_STRENGTH = 120;

        var entropy = this.calculateEntropy(validationResult);
        var bit = Math.log(Math.pow(entropy, inputLength)) / Math.log(2);
        var bitValue = Math.ceil(bit * (VERY_GOOD_STRENGTH / 100));

        var barColor = 'progress-bar';
        var removeClasses = '';
        if (bit <= MIN_STRENGTH || ! validationResult.isValid) {
            barColor = 'progress-bar progress-bar-danger';
            removeClasses = 'progress-bar-warning progress-bar-success';
        } else if (bit > MIN_STRENGTH && bit <= GOOD_STRENGTH) {
            barColor = 'progress-bar progress-bar-warning';
            removeClasses = 'progress-bar-danger progress-bar-success';
        } else if (bit > GOOD_STRENGTH) {
            barColor = 'progress-bar progress-bar-success';
            removeClasses = 'progress-bar-warning progress-bar-danger';
        }

        jQuery('#simo-password-strength').removeClass(removeClasses);
        jQuery('#simo-password-strength').addClass(barColor);
        jQuery('#simo-password-strength').css('width', bitValue.toString() + '%');
    }
});

var passwordValidator = new ProfilePasswordValidator();
