/**
 * @author ja
 * @class
 */
var AjaxUpdateTable = Class.extend({
	
	/**
	 * @type {jQuery}
	 */
	wrapper: null,
	
	/**
	 * @type {function}
	 */
	onAfterUpdate: null,
	
	/**
	 * @type {string}
	 */
	tableUrlPath: '',
	
	/**
	 * @type {string}
	 */
	fullPageUrlPath: '',
	
	/**
	 * @type {string}
	 */
	parameterIntent: '',
	
	/**
	 * @type {string}
	 */
	fullPageUrlHash: '',
	
	/**
	 * @author ja
	 * @constructs
	 * @param {jQuery} wrapper
	 * @param {string} tableUrlPath
	 * @param {string} fullPageUrlPath
	 */
	init: function(wrapper, tableUrlPath, fullPageUrlPath) {
		this.wrapper = wrapper;
		this.tableUrlPath = tableUrlPath;
		this.fullPageUrlPath = fullPageUrlPath;
		this.parameterIntent = 'intent';
		this.jQuery = jQuery;
	},
	
	/**
	 * @author rk
	 * @param fullPageUrlHash
	 * @return {void}
	 */
	setFullPageUrlHash: function (fullPageUrlHash) {
		this.fullPageUrlHash = fullPageUrlHash;
	},
	
	/**
	 * @author ja
	 * @return {jQuery}
	 */
	getLoadingSpinner: function() {
		return this.jQuery('.simo-loading-spinner');
	},
	
	/**
	 * @author ja
	 * @param {function} onAfterUpdateCallback
	 */
	setOnAfterUpdateCallback: function(onAfterUpdateCallback) {
		this.onAfterUpdate = onAfterUpdateCallback;
	},
	
	/**
	 * @author ja
	 * @param {string} url
	 * @return {void}
	 */
	update: function(url) {
		var that = this;
		this.addOverlay();
		this.jQuery.ajax({
			url: url,
			type: 'GET',
			context: this,
			success: function(data) {
				that.updateSuccess(data, url);
			}
		});
	},
	
	/**
	 * @author ja
	 * @return {void}
	 */
	addOverlay: function() {
		var loadingSpinner = this.getLoadingSpinner();
		if (typeof loadingSpinner !== 'undefined') {
			loadingSpinner.removeClass('hidden');
		}
	},
	
	/**
	 * @author ja
	 * @param {string} data
	 * @param {string} url
	 * @return {void}
	 */
	updateSuccess: function(data, url) {
		var contentWrapper = this.wrapper;
		contentWrapper.html(data);
		
		new InitializeContent(contentWrapper);
		this.removeOverlay();
		if (typeof this.onAfterUpdate === 'function') {
			this.onAfterUpdate();
		}
	},
	
	/**
	 * @author ja
	 * @return {void}
	 */
	removeOverlay: function() {
		var loadingSpinner = this.getLoadingSpinner();
		if (typeof loadingSpinner !== 'undefined') {
			loadingSpinner.addClass('hidden');
		}
	},
	
	/**
	 * @author rk
	 * @return {string}
	 */
	getUrl: function() {
		var parameterString = '';
		if (window.history.state) {
			parameterString = window.history.state.urlParameter;
		}
		if (parameterString) {
			parameterString = '?' + parameterString;
		}
		var portValue = '';
		if (window.location.port) {
			portValue = ':' + window.location.port;
		}
		return window.location.protocol + '//' + window.location.hostname + portValue + this.tableUrlPath + parameterString;
	},
	
	/**
	 * @author rk
	 * @param {string} url
	 * @param {string[]} newParameters
	 * @return {string}
	 */
	removeParametersFromUrl: function(url, newParameters) {
		var urlRepresentation = new URL(url);
		var urlParameters = urlRepresentation.searchParams;
		var urlParameterNames = Array.from(urlParameters.keys());
		
		for (var i = 0; i < newParameters.length; ++i) {
			var parameterPrefix = newParameters[i].replace('[]', '');
			
			for (var j = 0; j < urlParameterNames.length; ++j) {
				// parameters like 'x[]' should overwrite parameters like 'x[0]'
				if (urlParameterNames[j].search(parameterPrefix) !== -1) {
					urlParameters.delete(urlParameterNames[j]);
				}
			}
		}
		return urlRepresentation.toString();
	},
	
	/**
	 * @author rk
	 * @param {string} url
	 * @param {string} parameterName
	 * @param {int|string} parameterValue
	 * @return {string}
	 */
	appendParameterToUrl: function(url, parameterName, parameterValue) {
		var urlRepresentation = new URL(url);
		var oldParameters = urlRepresentation.searchParams;
		oldParameters.append(parameterName, parameterValue);
		return urlRepresentation.toString();
	},
	/**
	 * @author rk
	 * @param {string} url
	 * @param {string} intent
	 * @return {string}
	 */
	appendIntentParameterToUrl: function(url, intent) {
		url = this.removeParametersFromUrl(url, [this.parameterIntent]);
		return this.appendParameterToUrl(url, this.parameterIntent, intent);
	}
});
