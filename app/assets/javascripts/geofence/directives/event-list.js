angular.module('fmsGeofence')
.directive('eventList', function() {
	return {
		restrict: 'E',
		scope:{
			eventType:'@'
		},
		templateUrl: '/assets/geofence/views/sidebars/event-list.html',
		controller: function ($rootScope, $scope, $resource, $element, GridUtils, FmsUtils, RestApi)
		{
			/**
			 * 기본 날짜 검색일 설정 
			 */
			var toDateStr = FmsUtils.formatDate(new Date(), 'yyyy-MM-dd');
			var fromDate = FmsUtils.addDate(new Date(), -6);
			var fromDateStr = FmsUtils.formatDate(fromDate, 'yyyy-MM-dd');
			/**
			 * event_type from other directive
			 */
			var event_type ={}; 
			/**
			 * 조회 조건
			 */
			$scope.searchParams = {
				'ctm_gte': fromDateStr,
				'ctm_lte': toDateStr
			};
			/**
			 * Search DataSet
			 * 
			 * @type {Object}
			 */
			$scope.events = [];
			/**
			 * Page Information - Total Record Count & Total Page
			 * 
			 * @type {Object}
			 */
			$scope.pageInfo = { total: 0, total_page: 0, current_page: 0 };
			/**
			 * smart table object
			 */
			$scope.tablestate = null;
			/**
			 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
			 */
			$scope.searchEnabled = false;
			/**
			 * 현재 선택된 Geofence
			 * @type {Object}
			 */
			$scope.geofence = null;

			/**
			 * Normalize parameters
			 */
			$scope.normalizeSearchParams = function(params) {

				var searchParams = {
					'_o[ctm]': 'desc'
				};
				// convert date to number
				FmsUtils.buildDateConds(searchParams, 'ctm', params['ctm_gte'], params['ctm_lte']);

				if (!params) {
					return searchParams;
				}

				if (params.fleet_group_id) {
					searchParams["_q[fleet_group_id-eq]"] = params.fleet_group_id;
				}

				if (params.fleet_id) {
					searchParams["_q[fid-eq]"] = params.fleet_id;
				}

				var typeArr = [];

				if ($scope.eventType=='typ_impact') {
					typeArr.push(params['typ_impact']);
				}

				if ($scope.eventType=='typ_speed') {
					typeArr.push(params['typ_speed']);
				}

				if ($scope.eventType=='typ_geofence') {
					typeArr.push('I');
					typeArr.push('O');
					searchParams["_q[gid-eq]"] = $scope.geofence.id;
				}

				if ($scope.eventType=='typ_emergency') {
					typeArr.push(params['typ_emergency']);
				}

				if (typeArr.length == 1) {
					searchParams["_q[typ-eq]"] = typeArr[0];

				} else if (typeArr.length > 1) {
					searchParams["_q[typ-in]"] = typeArr.join(',');
				}

				return searchParams;
			};


			/**
			 * search events
			 */
			$scope.search = function(tablestate) {
				if (!$scope.searchEnabled) {
					$scope.searchEnabled = true;
					$scope.tablestate = tablestate;
					$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
					$scope.isLoading = false;
					return;
				}

				if (tablestate) {
					$scope.tablestate = tablestate;
				}

				var searchParams = $scope.beforeSearch();
				// $scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());

				$scope.doSearch(searchParams, function(dataSet) {
					$scope.numbering(dataSet.items, 1);
					$scope.events = dataSet.items;
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
				$scope.pageInfo.total = total_count;
				$scope.pageInfo.total_page = total_page;
				$scope.pageInfo.current_page = current_page;

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
				searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
				searchParams.fleet_id = searchParams.fleet ? searchParams.fleet.name : '';
				$scope.isLoading = true;
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
				RestApi.search('/events.json', params, function(dataSet) {
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
				// Map에 정보를 전달하여 지도에 표시하게 한다.
				//$scope.$emit('geofence-event-list-change', $scope.events);
				$scope.$emit('geofence-event-all-selected', $scope.geofence, $scope.events);
				// Grid Container를 새로 설정한다.
				FmsUtils.setGridContainerHieght('geofence-alert-table-container');
				$scope.isLoading = false;
			};

			/**
			 * Show group info to contents
			 * 
			 * @param  {Object}
			 * @return N/A
			 */
			$scope.goItem = function(eventAlert) {
				if(eventAlert && eventAlert.id) {
					$scope.setActiveItem(eventAlert);
					$scope.eventAlert = angular.copy(eventAlert);
					$scope.$emit('geofence-event-info-change', eventAlert);
				}
			};

			/**
			 * active item
			 * 
			 * @param {Object}
			 */
			$scope.setActiveItem = function(activeItem) {
				for (var i = 0; i < $scope.events.length; i++) {
					var item = $scope.events[i];
					item.active = (item.id == activeItem.id);
				}
			};

			/**
			 * form value 변화를 감지해서 자동 검색 
			 */
			$scope.$watchCollection('searchParams', function() {
				if ($scope.searchEnabled) {
					$scope.search($scope.tablestate);
				}
			});

			/**
			 * Scope destroy시 	
			 */
			$scope.$on('$destroy', function(event) {
				geofenceSelectListener();
			});
			
			var geofenceSelectListener = $rootScope.$on('geofence-item-selected', function(event, geofence) {
				$scope.geofence = geofence
				$scope.search(geofence);
			});

			/**
			 * 초기화 함수 
			 */
			$scope.init = function() {
				$scope.isLoading = false;
			};

			$scope.init();
		}
	};
})

// });