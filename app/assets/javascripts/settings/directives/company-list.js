angular.module('fmsSettings').directive('companyList', function() {
		return {
			restrict: 'E',
			controller: 'companyListCtrl',
			templateUrl: '/assets/settings/views/sidebars/company.html',
			scope: {},
			link: function(scope, element, attr, companyListCtrl) {
				var refreshButton = element.find('.panel-refresh');
				refreshButton.bind("click", function() {
					scope.search();
				});
			}
		};
	})
	.controller('companyListCtrl', function($rootScope, $scope, $timeout, GridUtils, FmsUtils, RestApi) {

		/**
		 * System Domain
		 * 
		 * @type {Boolean}
		 */
		$scope.systemCompany = currentDomain.system_flag;

		/**
		 * Company List
		 */
		$scope.items = [];

		/**
		 * Search Companies
		 */
		$scope.search = function() {
			$scope.doSearch(null, function(items) {
				$scope.numbering(items, 1);
				$scope.items = items;
				$scope.afterSearch(items);
			});
		};

		/**
		 * Items Numbering
		 * 
		 * @param  {Array}
		 * @param  {Number}
		 * @return N/A
		 */
		$scope.numbering = function(items, startNo) {
			for (var i = 0; i < items.length; i++) {
				items[i].no = i + 1;
			}
		};

		/**
		 * Domains 검색
		 * 
		 * @param  {Object}
		 * @param  {Function}
		 * @return N/A
		 */
		$scope.doSearch = function(params, callback) {
			if($scope.systemCompany) {
				RestApi.list('/domains.json', params, function(items) {
					callback(items);
				});
			} else {
				$scope.items[0] = currentDomain;
				callback($scope.items);
			}
		};

		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.afterSearch = function(items) {
			// grid container를 새로 설정한다.
			GridUtils.setGridContainerHieght('setting-company-table-container');
			if(!$scope.systemCompany) {
				$scope.goItem(items[0]);
			}
		};

		/**
		 * Show company info to contents
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.goItem = function(group) {
			$scope.setActiveItem(group);
			$scope.$emit('setting-company-item-change', group);
		};

		/**
		 * active item
		 * 
		 * @param {Object}
		 */
		$scope.setActiveItem = function(activeItem) {
			for(var i = 0 ; i < $scope.items.length ; i++) {
				var item = $scope.items[i];
				item.active = (item.id == activeItem.id);
			}
		};

		/**
		 * Company items changed so the list must be refreshed
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var companiesChangeListener = $rootScope.$on('setting-company-items-change', function(event) {
			$scope.search();
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    companiesChangeListener();
	  });
	  
		// ------------------------------ E N D -------------------------------------
	});