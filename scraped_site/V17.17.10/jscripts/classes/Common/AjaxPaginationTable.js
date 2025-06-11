/**
 * @author ja
 * @class
 */
var AjaxPaginationTable = Class.extend({
	
	/**
	 * @type {jQuery}
	 */
	wrapper: null,
	
	/**
	 * @type {string}
	 */
	paginationWrapper: '',
	
	/**
	 * @type {AjaxUpdateTable}
	 */
	ajaxUpdateTable: null,
	
	/**
	 * @type {string}
	 */
	parameterPageNumber: '',
	
	/**
	 * @type {string}
	 */
	parameterPageResults: '',
	
	/**
	 * @type {string}
	 */
	parameterValuePaginateIntent: '',
	
	/**
	 * @author ja
	 * @constructs
	 * @param {jQuery} wrapper
	 * @param {AjaxUpdateTable} ajaxUpdateTable
	 */
	init: function (wrapper, ajaxUpdateTable) {
		this.wrapper = wrapper;
		this.paginationWrapper = '.simo-pagination';
		this.ajaxUpdateTable = ajaxUpdateTable;
		this.parameterPageNumber = 'page';
		this.parameterPageResults = 'results';
		this.parameterValuePaginateIntent = 'paginate';
		
		this.initPagination();
	},
	
	/**
	 * @author ja
	 * @return void
	 */
	initPagination: function() {
		var that = this;
		var paginationElement = this.wrapper.find(this.paginationWrapper);
		paginationElement.find('a').off('click');
		paginationElement.find('a').on('click', function(event) {
			event.preventDefault();
			var url = event.currentTarget.href;
			if (url) {
				url = that.ajaxUpdateTable.appendIntentParameterToUrl(url, that.parameterValuePaginateIntent);
				that.ajaxUpdateTable.update(url);
			}
		});
	},
	
	/**
	 * @author rk
	 * @param {string} url
	 */
	resetPageNumberParameterFromUrl: function (url) {
		url = this.ajaxUpdateTable.removeParametersFromUrl(url, [this.parameterPageNumber]);
		return this.ajaxUpdateTable.appendParameterToUrl(url, this.parameterPageNumber, 1);
	}
});
