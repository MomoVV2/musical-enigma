
/**
 * Possibility to add callbacks if initializing is finished.
 *
 * @author MN
 * @return void
 */
var contentReadyCallbacks = [];
document.readyContent = function (readyCallback) {
	contentReadyCallbacks.push(readyCallback);
};

/**
 * Fire callbacks on finishing the initialization.
 *
 * @author MN
 * @return void
 */
document.contentIsReady = function () {
	while (contentReadyCallbacks.length > 0) {
		readyCallback = contentReadyCallbacks.shift();
		readyCallback();
	}
};

/**
 * Initializes external javascript plugins.
 *
 * @author MN
 */
var InitializeContent = Class.extend({

	/**
	 * Constructor.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	init: function (contentSelector) {
		this.initSelectpicker(contentSelector);
		this.initTinyMce(contentSelector);
		this.initFilestyle(contentSelector);
		this.initSlider(contentSelector);
		this.initDateTimepicker(contentSelector);
		this.initBootstrapTooltips(contentSelector);
		this.initBootstrapTabErrors(contentSelector);
		this.initColorpicker(contentSelector);
		this.initInputNumeric(contentSelector);
		this.initInputDecimal(contentSelector);
		this.initInputDecimalBoth(contentSelector);
		this.initPanelToggleButton(contentSelector);
		this.initCheckboxSelectAll(contentSelector);
		this.initSubmitFormButton(contentSelector);
		this.initOpenModal(contentSelector);
		this.initConfirmDelete(contentSelector);
		this.initAffixNavbar(contentSelector);
		this.initPostUrlButton(contentSelector);
		this.initRowCheckboxClicker(contentSelector);
		this.initSimoLoadingButton(contentSelector);
        this.initSimoLoadingAnimationComponent();
		this._initFaceliftContent();

		// initialization finished, fire callback functions.
		if (document.contentIsReady) {
			document.contentIsReady();
		}
	},

	/**
	 * Changes the main iframe to a post url.
	 *
	 * @author Benedikt Schaller
	 * @param {string} contentSelector
	 * @return void
	 */
	initPostUrlButton: function (contentSelector) {
		var mainFrame = top.document.getElementById('main');
		$.each($(contentSelector).find('.simo-url-change'), function (index, element) {
			$(element).click(function () {
				// Check the data attribute
				url = $(element).data('url-href');
				if (!url) {
					// Try to check href attribute as fallback if we have a link
					var url = $(element).attr('href');
				}
				var method = $(element).data('url-method');
				if (!method) {
					method = 'POST';
				}
				var data = {};
				var dataString = $(element).data('url-data');
				if (dataString) {
					var keyValueList = dataString.split('&');
					for (var i = 0; i < keyValueList.length; i++) {
						var keyValue = keyValueList[i];
						var keyValueParts = keyValue.split('=');
						data[keyValueParts[0]] = decodeURIComponent(keyValueParts[1]);
					}
				}
				if (url) {
					if (!mainFrame) {
						var body = $(document.body);
					} else {
						var body = $(mainFrame.contentDocument.body);
					}
					var form = $('<form action="' + url + '" method="' + method + '" ></form>');
					body.append(form);
					for (var key in data) {
						var value = data[key];
						form.append(jQuery('<input type="hidden" name="' + key + '" value="' + value.replace('"', '&quote;') + '" />'));
					}
					form.submit();
				}
			});
		});
	},

	/**
	 * open modal by data url.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initOpenModal: function (contentSelector) {
		$.each($(contentSelector).find('.simo-OpenModal'), function (index, element) {
			$(element).click(function (event) {
				event.preventDefault();

				var size = '';
				if ($(element).hasClass('large')) {
					size = 'modal-lg';
				}
				DialogAjaxHandler.openModal($(element).data('url'), size);
			});
		});
	},

	/**
	 * open modal by data url.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initConfirmDelete: function (contentSelector) {
		$.each($(contentSelector).find('.simo-ConfirmDelete'), function (index, element) {
			$(element).click(function () {
				var redirectUrl = encodeURIComponent($(element).data('url-redirect'));
				var text = encodeURIComponent($(element).data('text'));
				var url = '/message/confirm?url=' + redirectUrl + '&text=' + text;
				var size = '';
				if ($(element).hasClass('large')) {
					size = 'modal-lg';
				}
				DialogAjaxHandler.openModal(url, size);
			});
		});
	},

	/**
	 * Submits a form.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initSubmitFormButton: function (contentSelector) {
		$.each($(contentSelector).find('.simo-btn-SubmitForm'), function (index, element) {
			$(element).click(function () {
				$('#' + $(this).data('form'))[0].doSubmit();
			});
		});
	},

	/**
	 * select all checkboxes in the parents form.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initCheckboxSelectAll: function (contentSelector) {
		$.each($(contentSelector).find('.SelectAll'), function (index, element) {
			$(element).click(function () {
				$(element).closest('form').find(':checkbox:not(:disabled)').prop('checked', this.checked);
			});
		});
	},

	/**
	 * Panel toggle button
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initPanelToggleButton: function (contentSelector) {
		// select all button
		$.each($(contentSelector).find('.btn-panel-toggle'), function (index, element) {
			// is open
			var defaultStatus = $(element).data('status');
			if (defaultStatus == 'closed') {
				$(element).parents('.panel').find('.panel-body').hide();
			}

			$(element).click(function () {
				$(this).parents('.panel').find('.panel-body').slideToggle(100);

				var openGlyph = $(this).data('glyphicon-open');
				var closedGlyph = $(this).data('glyphicon-closed');

				var glyphicon = $(this).find('span');
				if (glyphicon.hasClass(openGlyph)) {
					glyphicon.removeClass(openGlyph);
					glyphicon.addClass(closedGlyph);
					return;
				}

				glyphicon.removeClass(closedGlyph);
				glyphicon.addClass(openGlyph);
			});
		});
	},

	/**
	 * Initialize selectpicker.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initSelectpicker: function (contentSelector) {
		$(contentSelector).find('.selectpicker').selectpicker();

		// select all button
		$.each($(contentSelector).find('.selectpickerSelectAll'), function (index, element) {
			$(element).click(function () {
				$(element).parent().parent().find('select').selectpicker('selectAll');
			});
		});

		// deselect all
		$.each($(contentSelector).find('.selectpickerDeselectAll'), function (index, element) {
			$(element).click(function () {
				$(element).parent().parent().find('select').selectpicker('deselectAll');
			});
		});

	},

	/**
	 * Initialize tinyMCE configs.
	 * Loaded via initialize/tinyMce.js .
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initTinyMce: function (contentSelector) {
		if (typeof tinyMCEConfigs === 'object') {
			for (var tinyMCESelector in tinyMCEConfigs) {
				var tinyMCEConfig = tinyMCEConfigs[tinyMCESelector];
				tinymce.init(tinyMCEConfig);
				//			$.each($(contentSelector).find(tinyMCESelector), function(index, element) {
				//				element = $(element);
				//				tinyMCEConfig.readonly = element.attr('readonly');
				//				tinyMCEConfig.language = element.attr('lang');
				//				element.tinymce(tinyMCEConfig);
				//			});
			}
		}
	},

	/**
	 * Initialize bootstrap file style component.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initFilestyle: function (contentSelector) {
		$(contentSelector).find('.filestyle').filestyle({
			buttonText: $(contentSelector).find('.filestyle').data('buttontext'),
			disabled: false
		});

		// clear button
		$.each($(contentSelector).find('.fileStyleDelete'), function (index, element) {
			$(element).click(function () {
				$(element).parent().parent().find('.filestyle').filestyle('clear');
			});
		});
	},

	/**
	 * Initialize bootstrap slider component.
	 *
	 * @author MN
	 * @param {string} contentSelector
	 * @return void
	 */
	initSlider: function (contentSelector) {
		$('.slider').slider();
	},

	/**
	 * Initialize datepicker component.
	 *
	 * @author jruss
	 * @param {string} contentSelector
	 * @return void
	 */
	initDateTimepicker: function (contentSelector) {
		// datetime
		$.each($(contentSelector).find('.dateTimepickerBootstrap'), function (index, element) {
			$(element).datetimepicker({
				language: $(element).prop('lang')
			});
		});

		// date
		$.each($(contentSelector).find('.datepickerBootstrap'), function (index, element) {
			$(element).datetimepicker({
				pickTime: false,
				language: $(element).prop('lang')
			});
		});

		// time
		$.each($(contentSelector).find('.timepickerBootstrap'), function (index, element) {
			$(element).datetimepicker({
				pickDate: false,
				language: $(element).prop('lang')
			});
		});
	},

	/**
	 * Initialize tooltip Bootstrap.
	 *
	 * @author jruss
	 * @param {string} contentSelector
	 * @return void
	 */
	initBootstrapTooltips: function (contentSelector) {
		// new
		$('[data-toggle="tooltip"]').tooltip();

		// old
		$.each($(contentSelector).find('.tooltipBootstrap'), function (index, element) {
			$(element).tooltip();
		});
	},

	/**
	 * Initialize Bootstrap tab errors.
	 *
	 * @param {string} contentSelector
	 * @return void
	 */
	initBootstrapTabErrors: function (contentSelector) {
		// Find all tabs, which contain errors, then mark them as error tabs
		var errorTabContents = $(contentSelector).find('form .tab-pane .has-error');
		if (errorTabContents.length > 0) {
			// Set all tabs inactive if errors exist
			$(contentSelector).find('form ul.nav-tabs li.nav.active').removeClass('active');
		}
		$.each(errorTabContents, function (index, element) {
			var tabPaneElement = $(element).closest('div[class^="tab-pane"]');
			var formElement = tabPaneElement.closest('form');
			var tabLinkElement = formElement.find('ul.nav-tabs li.nav a[href="#' + tabPaneElement.attr('id') + '"]');
			tabLinkElement.parent().addClass('has-error');
			// If no tab is active, show the first which contains errors
			if (formElement.find('ul.nav-tabs li.nav.active').length == 0) {
				tabLinkElement.tab('show');
			}
		});
	},

	/**
	 * Initialize colorpicker.
	 *
	 * @author mnoerenberg
	 * @param {string} contentSelector
	 * @return void
	 */
	initColorpicker: function (contentSelector) {
		$.each($(contentSelector).find('.bootstrap-colorpicker'), function (index, element) {
			$(element).colorpicker();
		});
	},

	/**
	 *
	 * Initialize input numeric.
	 *
	 * @author mnoerenberg
	 * @param {string} contentSelector
	 * @return void
	 */
	initInputNumeric: function (contentSelector) {
		$.each($(contentSelector).find('.InputNumeric'), function (index, element) {
			$(element).keypress(function (event) {
				var keycode = (event.which) ? event.which : event.keyCode
				if (keycode > 31 && (keycode < 48 || keycode > 57)) {
					return false;
				}

				return true;
			});
		});

		$.each($(contentSelector).find('.InputNumericNegative'), function (index, element) {
			$(element).keypress(function (event) {
				var keycode = (event.which) ? event.which : event.keyCode
				if (keycode == 45) {
					return true;
				}
				if (keycode > 31 && (keycode < 48 || keycode > 57)) {
					return false;
				}

				return true;
			});
		});
	},

	/**
	 *
	 * Initialize input decimal.
	 *
	 * @author mnoerenberg
	 * @param {string} contentSelector
	 * @return void
	 */
	initInputDecimal: function (contentSelector) {
		$.each($(contentSelector).find('.InputDecimal'), function (index, element) {
			$(element).numeric({ decimal: ",", negative: false });
		});
	},

	/**
	 *
	 * Initialize input decimal with dot and comma as seperator.
	 *
	 * @author mnoerenberg
	 * @param {string} contentSelector
	 * @return void
	 */
	initInputDecimalBoth: function (contentSelector) {
		$.each($(contentSelector).find('.InputDecimalBoth'), function (index, element) {
			$(element).keypress(function (event) {
				var keycode = (event.which) ? event.which : event.keyCode
				var element = $(this);

				if (keycode == 46 || keycode == 44) {
					if (element.prop('value').indexOf(',') !== -1 || element.prop('value').indexOf('.') !== -1) {
						return false;
					}
					return true;
				}

				if (keycode > 31 && (keycode < 48 || keycode > 57)) {
					return false;
				}

				return true;
			});
		});
	},

	/**
	 *
	 * Initialize affix navbars.
	 *
	 * @author mnoerenberg
	 * @param {string} contentSelector
	 * @return void
	 */
	initAffixNavbar: function (contentSelector) {
		$.each($(contentSelector).find('.AffixNavbar'), function (index, element) {
			$(element).affix({
				offset: {
					top: $(element).offset().top
				}
			});
			$('.AffixWrapper').height($(element).height());
		});
	},

	/**
	 * Click on a row and the checkbox in the row is being clicked.
	 *
	 * @author rk
	 * @param {string} contentSelector
	 * @return {undefined}
	 */
	initRowCheckboxClicker: function (contentSelector) {
		$.each($(contentSelector).find('table.simo-row-checkbox-clicker, tbody.simo-row-checkbox-clicker'), function (index, element) {
			$(element).find('tr').click(function (event) {
				if (event.target.type !== 'checkbox') {
					$(this).find('input[type=checkbox]').trigger('click');
				}
			});
		})
	},


	/**
	 * @author tp
	 * @param {string|jQuery} contentSelector
	 * @return void
	 */
	initSimoLoadingButton: function (contentSelector) {
		$(contentSelector).find('.simo-loading-button').on('click', function () {
			$('.simo-loading-spinner').removeClass('hidden');
		});
	},

	/**
	 * @author ja
	 * @return {void}
	 * @private
	 */
	_initFaceliftContent: function () {
		if (typeof initFaceliftContent === 'function') {
			initFaceliftContent();
		}
		if (typeof initializeTableOnLoad === 'function') {
			initializeTableOnLoad();
		}
	},

    initSimoLoadingAnimationComponent: function () {
        customElements.get('simo-loading-animation') || customElements.define('simo-loading-animation', SimoLoadingAnimationComponent)
    }
});
