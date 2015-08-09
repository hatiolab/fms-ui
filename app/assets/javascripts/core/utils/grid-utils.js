angular.module('fmsCore').factory('GridUtils', function($rootScope) {
	
	return {

		/**
		 * Grid Buffer Count
		 * 
		 * @return {Number}
		 */
		getGridBufferCount : function() {
			var bufferCount = $rootScope.getIntSetting('default_grid_buffer_count');
			return bufferCount ? bufferCount : 200;
		},

		/**
		 * Count Per Page
		 * 
		 * @return {Number}
		 */
		getGridCountPerPage : function() {
			var countPerPage = $rootScope.getIntSetting('default_count_per_page');
			return countPerPage ? countPerPage : 50;
		},

		/**
		 * Length Threshold
		 * 
		 * @return {Number}
		 */
		getGridLengthThreshold : function() {
			return 20;
		},

		/**
		 * Time Threshold
		 * 
		 * @return {Number}
		 */
		getTimeThreshold : function() {
			return 400;
		}

		//------------------------------- E N D ------------------------------------
	};
});
