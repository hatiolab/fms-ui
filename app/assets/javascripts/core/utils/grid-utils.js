angular.module('fmsCore').factory('GridUtils', function($rootScope) {

	return {

		/**
		 * grid container height
		 * 전체 윈도우 Height에서 테이블 제외 Height를 뺀 Height를 설정해준다.
		 */		
		resetAllGridContainerHeight : function() {
			var gridContainers = [
				'monitor-alert-table-container', 
				'monitor-fleet-table-container',
				'monitor-side-info-trip-table-container',
				'monitor-side-info-alert-table-container',
				'geofence-view-table-container',
				'geofence-setting-table-container',
				'geofence-assignment-table-container',
				'geofence-relation-table-container',
				'hr-overspeed-table-container',
				'hr-drivehabit-table-container',
				'hr-drivetime-table-container',
				'hr-drivedist-table-container',
				'report-fleet-alert-table-container',
				'report-fleet-drive-table-container',
				'report-group-alert-table-container',
				'report-group-drive-table-container',
				'setting-driver-table-container',
				'setting-fleet-table-container',
				'setting-group-relation-table-container',
				'setting-company-table-container',				
				'setting-user-table-container'
			];
			
			var me = this;

			angular.forEach(gridContainers, function(gridContainerId) {
				me.setGridContainerHieght(gridContainerId)
			});
		},

		/**
		 * grid container height
		 * 전체 윈도우 Height에서 테이블 제외 Height를 뺀 Height를 설정해준다.
		 */
		setGridContainerHieght : function(gridContainerId) {
			var newHeight = $(window).height();
			var gridContainer = angular.element('#' + gridContainerId);

			if(!gridContainer) {
				return;
			}

			if(gridContainerId == 'monitor-alert-table-container') {
				newHeight = newHeight - 340;

			} else if(gridContainerId == 'monitor-fleet-table-container') {
				newHeight = newHeight - 213;

			} else if(gridContainerId == 'monitor-side-info-trip-table-container' || gridContainerId == 'monitor-side-info-alert-table-container') {
				newHeight = newHeight - 360;

			} else if(gridContainerId == 'geofence-view-table-container' || gridContainerId == 'geofence-alert-table-container') {
				newHeight = (newHeight - 275) / 2;

			} else if(gridContainerId == 'geofence-setting-table-container') {
				newHeight = newHeight - 465;

			} else if(gridContainerId == 'geofence-assignment-table-container') {
				newHeight = newHeight - 270;

			} else if(gridContainerId == 'geofence-relation-table-container') {
				newHeight = newHeight - 320;
				
			} else if(gridContainerId == 'setting-driver-table-container') {
				newHeight = newHeight - 340;

			} else if(gridContainerId == 'setting-fleet-table-container') {
				newHeight = newHeight - 400;

			} else if(gridContainerId == 'setting-group-table-container') {
				newHeight = newHeight - 300;

			} else if(gridContainerId == 'setting-company-table-container') {
				newHeight = newHeight - 270;

			} else if(gridContainerId == 'setting-user-table-container') {
				newHeight = newHeight - 310;

			} else if(gridContainerId == 'setting-group-relation-table-container') {
				newHeight = newHeight - 323;

			} else if(gridContainerId == 'hr-overspeed-table-container' || gridContainerId == 'hr-drivehabit-table-container' || gridContainerId == 'hr-drivetime-table-container' || gridContainerId == 'hr-drivedist-table-container') {
				newHeight = newHeight - 340;

			} else if(gridContainerId == 'report-fleet-alert-table-container') {
				newHeight = newHeight - 430;

			} else if(gridContainerId == 'report-fleet-drive-table-container') {
				newHeight = newHeight - 410;

			} else if(gridContainerId == 'report-group-alert-table-container' || gridContainerId == 'report-group-drive-table-container') {
				newHeight = newHeight - 325;				
			}

			if(newHeight > 10) {
				gridContainer.height(newHeight);
			}
		},

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