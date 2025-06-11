/**
 * Dialog Ajax Handler.
 *
 * @access public
 */
var DialogAjaxHandler = new function DialogAjaxHandler() {

	/**
	 * Saves a dialog form by ajax call.
	 * Creates the error and success message gui.
	 */
	this.save = function(module, command, formSelector, dialogSelector, onSuccessCommand, callback) {

		this.ajaxHandler = new AjaxHandler(module);
		this.ajaxHandler.call(command, $(formSelector).serialize(), function(data) {

			if (data.length > 0) {
				var alerts = $('#alerts');
				alerts.html('');

				// close button
				var closeButton = $('<button class="close" aria-hidden="true" data-dismiss="alert"></button>');
				closeButton.text('×');

				// danger panel
				var dangerContentDiv = $('<div class="alert alert-dismissable alert-danger" style="display: none;"></div>');
				dangerContentDiv.append(closeButton);
				alerts.append(dangerContentDiv);
				var dangerList = $('<ul style="list-style: none; padding-left: 5px;"></ul>');
				dangerContentDiv.append(dangerList);

				// success panel
				var successContentDiv = $('<div class="alert alert-dismissable alert-success" style="display: none;"></div>');
				successContentDiv.append(closeButton);
				alerts.append(successContentDiv);
				var successList = $('<ul></ul>');
				successContentDiv.append(successList);

				$(data).each(function(index, dialogMessage) {
					var li = $('<li></li>');
					li.text(dialogMessage.message);
					if (dialogMessage.type == 1) {
						// error
						dangerList.append(li);
						dangerList.parent().css('display', 'block');
					} else if (dialogMessage.type == 2) {
						// success
						successList.append(li);
						successList.parent().css('display', 'block');
					}
				});
			} else if (onSuccessCommand != '') {
				document.location.href = onSuccessCommand;
			} else if (callback) {
				callback();
				$(dialogSelector).modal('hide');
			} else {
				// no message, reload page.
				document.location.reload();
			}
		});
	};

	/**
	 * Loads the dialog.
	 */
	this.loadDialog = function(command, dialogSelector) {
		// load the url and show modal on success
		$(dialogSelector + ' .modal-content').load(command, function() {
			new InitializeContent(dialogSelector + ' .modal-content');
			$(dialogSelector).modal('show');
		});
	};


	/////////////////////////////////////////// default modal

	/**
	 * Closes the dialog.
	 */
	this.closeModal = function() {
		var defaultModal = $('#defaultModal');
		defaultModal.modal('hide');
	};

	/**
	 * Closes the dialog and reloads the page.
	 */
	this.closeModalReloadPage = function() {
		window.location.reload();
	};

	/**
	 * Loads the default dialog.
	 * DialogAjaxHandler.loadDialog('/FormGenerator/CategoryDialog');
	 */
	this.openModal = function(url, size, data = null) {
		this.openLoadingDialog(size);
		var defaultModal = $('#defaultModal');
		var defaultModalContent = defaultModal.find('.modal-content');

		defaultModalContent.load(url, data, function(response, status, xhr) {
			// If an error occured we have to manually set the html content to the main body
			if (status == 'error') {
				$('body').html(response);
			} else {
				new InitializeContent('#defaultModal .modal-content');
				$('#defaultModal').modal({
					backdrop: 'static',
					keyboard: true,
					show: true
				});
				new SimoCommunityAjaxSubmit();
			}
		});
	};

	/**
	 * Opens a loading modal.
	 *
	 * @param size
	 */
	this.openLoadingDialog = function(size) {
		var defaultModal = $('#defaultModal');
		var defaultModalContent = defaultModal.find('.modal-content');
		var defaultModalDialog = defaultModal.find('.modal-dialog');
		var loadingModalContent = $('#defaultLoadingModalContent');
		defaultModalContent.html(loadingModalContent.html());
		defaultModal.modal({
			backdrop: 'static',
			keyboard: true,
			show: true
		});

		// set the default value to an empty string
		size = typeof size !== 'undefined' ? size : '';
		// load the url and show modal on success

		// define size of modal
		defaultModalDialog.removeClass('modal-lg');
		defaultModalDialog.removeClass('modal-xlg');
		defaultModalDialog.removeClass('modal-sm');
		if (size == 'modal-lg' || size == 'modal-xlg' || size == 'modal-sm') {
			defaultModalDialog.addClass(size);
		}
	}
};
