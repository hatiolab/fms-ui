angular.module('fmsSettings').directive('groupList', function() {
		return {
			restrict: 'E',
			controller: 'groupListCtrl',
			templateUrl: '/assets/settings/views/sidebars/groups.html',
			scope: {},
			link: function(scope, element, attr, groupListCtrl) {
				var refreshButton = element.find('#searchGroups');
				refreshButton.bind("click", function() {
					scope.search(scope.tablestate);
				});
			}
		};
	})
	.controller('groupListCtrl', function($rootScope, $scope, $resource, $element, GridUtils, FmsUtils, RestApi) {

		/**
		 * Group List
		 */
		$scope.items = [];
		/**
		 * 검색 조건 모델 
		 */
		$scope.searchParams = {};
		/**
		 * smart table object
		 */
		$scope.tablestate = null;
		/**
		 * 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.
		 */
		$scope.searchEnabled = false;

		/**
		 * 서버에 보내기위해 파라미터 변경  
		 */
		$scope.normalizeSearchParams = function(params) {
			var searchParams = {
				'_o[name]': 'asc'
			};

			if (!params || FmsUtils.isEmpty(params)) {
				return searchParams;
			}

			if (params.name) {
				searchParams["_q[name-like]"] = params.name;
			}

			if (params.description) {
				searchParams["_q[description-like]"] = params.description;
			}

			return searchParams;
		};

		/**
		 * Search Groups
		 */
		$scope.search = function(tablestate) {
			if (!$scope.searchEnabled) {
				$scope.searchEnabled = true;
				$scope.tablestate = tablestate;
				$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
			}

			if (tablestate) {
				$scope.tablestate = tablestate;
			}

			searchParams = angular.copy($scope.searchParams);
			searchParams = $scope.normalizeSearchParams(searchParams);
			$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());

			$scope.doSearch(searchParams, function(dataSet) {
				$scope.numbering(dataSet.items, 1);
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet);
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
		 * 페이지네이션 검색 정보를 설정한다. 
		 *
		 * @param {Object}
		 * @param {Object}
		 * @param {Number}
		 * @param {Number}
		 */
		$scope.setPageQueryInfo = function(searchParams, pagination, start, limit) {
			searchParams.start = start;
			searchParams.limit = limit;
			pagination.start = start;
			pagination.number = limit;
		}

		/**
		 * 페이지네이션 결과 정보를 설정한다. 
		 * 
		 * @param {Number}
		 * @param {Number}
		 * @param {Number}
		 */
		$scope.setPageReultInfo = function(total_count, total_page, current_page) {
			if ($scope.tablestate && $scope.tablestate.pagination) {
				$scope.tablestate.pagination.totalItemCount = total_count;
				$scope.tablestate.pagination.numberOfPages = total_page;
				$scope.tablestate.pagination.currentPage = current_page;
			}
		};

		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @return {Object}
		 */
		$scope.beforeSearch = function() {
			var searchParams = angular.copy($scope.searchParams);
			return $scope.normalizeSearchParams(searchParams);
		};

		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @param  {Object}
		 * @param  {Function}
		 * @return N/A
		 */
		$scope.doSearch = function(params, callback) {
			RestApi.search('/fleet_groups.json', params, function(dataSet) {
				callback(dataSet);
			});
		};

		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.afterSearch = function(dataSet) {
			$scope.setPageReultInfo(dataSet.total, dataSet.total_page, dataSet.page);
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('setting-group-table-container');
		};

		/**
		 * Show group info to contents
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.goItem = function(group) {
			$scope.setActiveItem(group);
			$scope.$emit('setting-group-item-change', group);
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
		 * Watch fleetSearchParams in page scope, if changed trigger pageFleets in same scope
		 * 
		 * @param  {String}
		 * @return N/A
		 */
		$scope.$watchCollection('searchParams', function() {
			if ($scope.searchEnabled) {
				$scope.search($scope.tablestate);
			}
		});

		/**
		 * Driver items changed so the list must be refreshed
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var groupsChangeListener = $rootScope.$on('setting-group-items-change', function(event) {
			$scope.search($scope.tablestate);
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    groupsChangeListener();
	  });
	  
		// ------------------------------ E N D -------------------------------------
	});