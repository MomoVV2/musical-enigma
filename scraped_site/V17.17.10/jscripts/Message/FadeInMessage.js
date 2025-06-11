/**
 * @author tp
 */
var FadeInMessage = Class.extend({

	/**
	 * @private
	 * @type {jQuery}
	 */
	html: null,

	/**
	 * @author tp
	 * @constructor
	 */
	init: function(headline, text, type) {
		var modal =
			'<div class="row simo-fade-in-message" style="display: none;">' +
				'<div class="col-sm-12">' +
					'<div class="alert alert-success">' +
						'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
							'×</button>' +
						'<span class="fa-regular fa-check"></span> <strong>' + headline + '</strong>' +
						'<hr class="simo-alert-separator">' +
						'<p>' + text + '</p>' +
					'</div>' +
				'</div>' +
			'</div>';

		this.html = $(modal);
		if (type == 'advertisement') {
			this.setModalTypeAdvertisement();
		}
	},

	/**
	 * @author tp
	 * @return void
	 */
	show: function(showTimeInSeconds) {
		this.appendToMessages();
		if (! showTimeInSeconds) {
			showTimeInSeconds = 5;
		}
		showTime = showTimeInSeconds * 1000;
		this.html.fadeIn(500);
		this.html.delay(showTime).fadeOut(500);
	},

	/**
	 * @author Benedikt Schaller
	 * @return {void}
	 */
	showPermanent: function() {
		this.appendToMessages();
		this.html.fadeIn(500);
	},

	/**
	 * @author Benedikt Schaller
	 * @return {void}
	 */
	appendToMessages: function() {
		$(window.parent.document).find('#fade-in-message-container').append(this.html);
	},

	/**
	 * @author ja
	 * @return {void}
	 */
	setModalTypeDanger: function() {
		var alertContainer = this.html.find('div.alert');
		var glyphIcon = $(alertContainer).find('span.glyphicon');
		alertContainer.removeClass();
		alertContainer.addClass('alert alert-danger');
		glyphIcon.removeClass();
		glyphIcon.addClass('fa-regular fa-xmark');
	},

	/**
	 * @author Benedikt Schaller
	 * @return {void}
	 */
	setModalTypeAdvertisement: function() {
		var alertContainer = this.html.find('div.alert');
		var glyphIcon = $(alertContainer).find('span.glyphicon');
		alertContainer.removeClass();
		alertContainer.addClass('alert alert-info');
		glyphIcon.removeClass();
		glyphIcon.addClass('fa-regular fa-star');
	}
});
