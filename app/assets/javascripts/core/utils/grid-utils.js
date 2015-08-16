angular.module('fmsCore').factory('GridUtils', function($rootScope) {

	return {

		/**
		 * Grid Buffer Count
		 * 
		 * @return {Number}
		 */
		getGridBufferCount: function() {
			var bufferCount = $rootScope.getIntSetting('default_grid_buffer_count');
			return bufferCount ? bufferCount : 200;
		},

		/**
		 * Count Per Page
		 * 
		 * @return {Number}
		 */
		getGridCountPerPage: function() {
			var countPerPage = $rootScope.getIntSetting('default_count_per_page');
			return countPerPage ? countPerPage : 50;
		},

		/**
		 * Length Threshold
		 * 
		 * @return {Number}
		 */
		getGridLengthThreshold: function() {
			return 20;
		},

		/**
		 * Time Threshold
		 * 
		 * @return {Number}
		 */
		getTimeThreshold: function() {
			return 400;
		},

		/**
		 * Change Info bar Height
		 */
		setInfobarHeight: function(divSelector, mode) {
			var newHeight = $(window).height();
			var container = angular.element(divSelector);
			if (!container) {
				return;
			}

			var headerHeight = angular.element('header').height();

			switch (mode) {
				case "full":
					newHeight = newHeight - headerHeight;
					break;
				case "half":
					newHeight = (newHeight - 55) / 2;
					break;
				case "mini":
					newHeight = (newHeight - 55) / 3;
					break;
				case "zero":
					newHeight = 25;
					break;
				default:
					newHeight = (newHeight - 55) / 3;
			}

			container.height(newHeight);
			return newHeight;
		}

		//------------------------------- E N D ------------------------------------
	};
});