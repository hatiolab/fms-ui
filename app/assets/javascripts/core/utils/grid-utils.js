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
		 * @param {[type]} gridContainerId [grid Id]
		 * @param {[type]} mode            [full(screen size-55px), half((screen height-55px) * 50%), mini(272)]
		 */
		setInfobarGridContainerMode: function(gridContainerId, mode) {
			var newHeight = $(window).height();
			var gridContainer = angular.element('#' + gridContainerId);
			var headerHeight = angular.element('header').height();
			var infolistBarHeight = angular.element('ul.nav.nav-tabs').height();
			var infolistBarConditionHeight = angular.element('form.form-horizontal.ng-pristine.ng-valid').height();
			// console.log(infolistBarHeight);

			if (!gridContainer) {
				return;
			}
			switch (mode) {
				case "full":
					newHeight = newHeight-headerHeight-25-12.8-25;//size of inforbar 25
					break;
				case "half":
					newHeight = (newHeight - 55)/2;
					break;
				case "mini":
					newHeight = 350;
					break;
				default:
					newHeight = 350;
			}

			if(newHeight > 10) {
				gridContainer.height(newHeight);
			}
		},
		//------------------------------- E N D ------------------------------------
	};
});