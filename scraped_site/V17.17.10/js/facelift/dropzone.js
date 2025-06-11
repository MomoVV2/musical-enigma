var dropzoneSettings = function() {
	let basicDropzoneSettings = {
		url: "?action=uploadFile",
		maxFilesize: 100,
		paramName: "uploadfiles",
		maxThumbnailFilesize: 5,
		uploadMultiple: false,
		previewsContainer: '.uploaded-file-preview',
		previewTemplate: document.getElementById('preview-template').innerHTML,
		init: function () {
			let uploadedFileIds = [];

			this.on('success', function (uploadedFile, response) {
				uploadedFileIds.push(response.fileId);

				fileUploadSuccess(uploadedFile, response.fileId);
				toggleDisableSubmit(false);

				$('#files').prop('value', JSON.stringify(uploadedFileIds));
			});

			this.on('complete', function (file) {
				console.log('uploaded file', file);
				fileUploadSuccess(file);
			});

			this.on('sending', function (file) {
				$('.uploaded-file-preview').css('display', 'block');
				toggleDisableSubmit(true);
			});

			this.on('queuecomplete', function (file) {
				toggleDisableSubmit(false);
			});

			this.on('removedfile', function (toBeRemovedFile, response) {
				let clickedFileId = $(toBeRemovedFile.previewElement).find('.remove-file').attr('file-id');
				$.ajax({
					method: "GET",
					url: "?action=deleteFile&&fileId=" + clickedFileId
				});

				for (let i = 0; i < uploadedFileIds.length; i++) {
					if (clickedFileId == uploadedFileIds[i]) {
						uploadedFileIds.splice(i, 1);
					}
				}

				$('#files').prop('value', JSON.stringify(uploadedFileIds));
				return true;
			});

			function toggleDisableSubmit(newStatus) {
				$("#submit").prop('disabled', newStatus);
			}

			function fileUploadSuccess(file, fileId) {
				$(file.previewElement).find('.error').css('border-bottom', '2px solid green');
				$(file.previewElement).find('.remove-file').attr('file-id', fileId);
				$(file.previewElement).find('.remove-file').css('cursor', 'pointer');
			}
		}
	};

	$(".paperclip").dropzone(basicDropzoneSettings);
	basicDropzoneSettings.clickable = false;
	$(".dropOnly").dropzone(basicDropzoneSettings);
}
