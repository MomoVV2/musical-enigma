
var fileUpload = function() {
	$('.form__upload').each(function() {
		var that = $(this);

		that.on('change', 'input', function(e) {
			getFileUpload(e, that);
		});

		// Handle drag'n'drop
		that.on('dragover', 'label', function() {
			that.addClass('drag');
		});

		that.on('dragleave', 'label', function() {
			that.removeClass('drag');
		});
	});
};

var getFileUpload = function(e, target) {
	if (!e.currentTarget.files || !e.currentTarget.files[0]) {
		return;
	}

	var allowedFileTypes = [
		'image/jpeg',
		'image/png',
		'image/jpeg'
	];

	var file = e.currentTarget.files[0];

	var fileSizeInMb = Math.round(((file.size / 1024 / 1024) + Number.EPSILON) * 100) / 100;
	var validFileType = allowedFileTypes.indexOf(file.type) > -1;

	var imageCropper = jQuery('#imageToCrop').data('cropper');

	var invalidDataTypeVisible = $('#invalidDataTypeVisible');
	var invalidDataSizeVisible = $('#invalidDataSizeVisible');

	invalidDataTypeVisible.addClass('hidden');
	invalidDataSizeVisible.addClass('hidden');

	if (validFileType === false) {
		invalidDataTypeVisible.removeClass('hidden');
		return;
	} else if (fileSizeInMb > 5.0) {
		invalidDataSizeVisible.removeClass('hidden');
		return;
	}

	var fileReader = new FileReader();

	fileReader.onload = function(file) {
		imageCropper.replace(file.target.result);

		$('#chooseImageArea').addClass('hidden');
		$('#cropperArea').removeClass('hidden');
		$('#submitButton').removeClass('disabled');

		target.find('button').fadeIn('fast');
		target.find('input').fadeOut('fast');
	};

	fileReader.readAsDataURL(e.currentTarget.files[0]);
};
