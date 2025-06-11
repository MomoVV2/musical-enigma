/**
 * @author ja
 * @class
 */
var AjaxFilterFormTable = Class.extend({
	
	/**
	 * @type {jQuery}
	 */
	filterForm: null,
	
	/**
	 * @type {AjaxUpdateTable}
	 */
	ajaxUpdateTable: null,
	
	/**
	 * @type {AjaxPaginationTable}
	 */
	ajaxPaginationTable: null,
	
	/**
	 * @type {string}
	 */
	parameterValueFilterIntent: '',
	
	/**
	 * @author ja
	 * @constructs
	 * @param {jQuery} filterForm
	 * @param {AjaxUpdateTable} ajaxUpdateTable
	 * @param {AjaxPaginationTable} ajaxPaginationTable
	 */
	init: function(filterForm, ajaxUpdateTable, ajaxPaginationTable) {
		this.filterForm = filterForm;
		this.ajaxUpdateTable = ajaxUpdateTable;
		this.ajaxPaginationTable = ajaxPaginationTable;
		this.parameterValueFilterIntent = 'filter';
		
		this.initFilter();
	},
	
	/**
	 * @author ja
	 * @return {void}
	 */
	initFilter: function() {
		var that = this;
		var selectBoxes = this.filterForm.find('select');
		var submitButtons = this.filterForm.find('[type="submit"]');
		var searchField = this.filterForm.find('.simo-ajax-search');
		
		selectBoxes.off('changed.bs.select');
		selectBoxes.on('changed.bs.select', function() {
			that.onFilterChange();
		});
		submitButtons.off('click');
		submitButtons.on('click', function(clickEvent) {
			clickEvent.preventDefault();
			that.onFilterChange();
		});
		searchField.off('keypress');
		searchField.on('keypress', function(ev) {
			var keycode = (ev.keyCode ? ev.keyCode : ev.which);
			if (keycode == '13') {
				that.onFilterChange();
			}
		});
	},
	
	/**
	 * @author ja
	 * @return {void}
	 */
	onFilterChange: function() {
		var url = this.removeAllPreviousFilterFromUrl();
		var parameters = this.filterForm.serializeArray();
		for (var i = 0; i < parameters.length; ++i) {
			url = this.ajaxUpdateTable.appendParameterToUrl(url, parameters[i]['name'], parameters[i]['value']);
		}
		url = this.ajaxUpdateTable.appendIntentParameterToUrl(url, this.parameterValueFilterIntent);
		this.ajaxUpdateTable.update(url);
	},
	
	/**
	 * @author ja
	 * @return {string}
	 */
	removeAllPreviousFilterFromUrl: function() {
		var filterParameterNames = [];
		this.filterForm.find('select, input').each(function() {
			filterParameterNames.push(this.name);
		});
		var cleanUrl = this.ajaxUpdateTable.removeParametersFromUrl(this.ajaxUpdateTable.getUrl(), filterParameterNames);
		return this.ajaxPaginationTable.resetPageNumberParameterFromUrl(cleanUrl);
	}
});
