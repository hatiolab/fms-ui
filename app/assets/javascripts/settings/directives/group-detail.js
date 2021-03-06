angular.module('fmsSettings').directive('groupDetail', function() {
		return {
			restrict: 'E',
			controller: 'groupDetailCtrl',
			templateUrl: '/assets/settings/views/contents/groups.html',
			scope: {},
			link: function(scope, element, attr, groupDetailCtrl) {}
		};
	})
	.controller('groupDetailCtrl', function($rootScope, $scope, $resource, $element, $filter, ModalUtils, GridUtils, RestApi) {

		/**
		 * Selected Group Item
		 * 
		 * @type {Object}
		 */
		$scope.item = {};
		/**
		 * Group - Geofence Relation List
		 */
		$scope.items = [];
		/**
		 * Geofence List
		 */
		$scope.geofences = [];

		/**
		 * Search Groups
		 */
		$scope.searchGeoGroups = function() {
			var searchParams = { '_o[geofence_id]': 'asc', "_q[fleet_group_id-eq]" : $scope.item.id };
			RestApi.list('/geofence_groups.json', searchParams, function(dataList) {
				$scope.numbering(dataList, 1);
				$scope.items = dataList;
			});
		};

		/**
		 * Search geofence
		 */
		$scope.searchGeofences = function(callback) {
			RestApi.list('/geofences.json', {}, function(dataList) {
				$scope.geofences = dataList;
				if(callback) {
					callback();
				}
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
				var item = items[i];
				item.no = i + 1;
				item.isEditable = true;
				item.isShow = true;
				item.deleteFlag = false;
			}
		};

		/**
		 * Form이 유효한 지 체크 
		 * @return {Boolean}
		 */
		$scope.isFormValid = function() {
			return true;
		};

		/**
		 * 삭제 가능한 지 여부 
		 * @return {Boolean}
		 */
		$scope.isDeletable = function() {
			return $scope.item.id ? true : false;
		};

		/**
		 * Check form validation
		 * 
		 * @return N/A
		 */
		$scope.checkValidForm = function() {
			if (!$scope.item.name || $scope.item.name == '') {
				return $scope.showAlerMsg('Name must not be empty!');
			}

			return $scope.checkRelations();
		};

		/**
		 * Build Geofence - Group Relations Data for Multiple Update
		 */
		$scope.checkRelations = function() {
			for (var i = 0; i < $scope.items.length; i++) {
				var relation = $scope.items[i];
				if(!relation.alarm_type || relation.alarm_type == '') {
					return $scope.showAlerMsg('Event must not be empty!');
				}

				if(!relation.geofence_id || relation.geofence_id == '') {
					return $scope.showAlerMsg('Geofence must not be empty!');
				}			
			}

			// Check Unique Relation
			return $scope.checkRelationDuplicated();
		};

		/**
		 * Check Relation is duplicated
		 * 
		 * @return {Boolean}
		 */
		$scope.checkRelationDuplicated = function() {
			var items = $scope.buildRelations();
			var groups = [];

			for(var i = 0 ; i < items.length ; i++) {
				var item = items[i];
				var keyValue = item.geofence_id + '-' + item.alarm_type;
				if(groups.indexOf(keyValue) >= 0) {
					return $scope.showAlerMsg('Same Group & Event is not allowed!');
				}
				groups.push(keyValue);
			}

			return true;
		};		

		/**
		 * Show Alert Message
		 * 
		 * @param  {String}
		 * @return {Boolean}
		 */
		$scope.showAlerMsg = function(msg) {
			ModalUtils.alert('sm', 'Alert', msg);
			return false;
		};

		/**
		 * Save - Create or Update
		 * 
		 * @return {Object}
		 */
		$scope.save = function() {
			if ($scope.checkValidForm()) {
				if ($scope.item.id && $scope.item.id != '') {
					$scope.updateGroup();
				} else {
					$scope.createGroup();
				}
			}
		};

		/**
		 * Update Group
		 */
		$scope.updateGroup = function() {
			var url = '/fleet_groups/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, { fleet_group: $scope.item });

			result.$promise.then(
				function(data) {
					$scope.updateRelations();
				}, 
				function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		};

		/**
		 * Create Group
		 */
		$scope.createGroup = function() {
			RestApi.checkUnique('/fleet_groups/show_by_name.json?name=' + $scope.item.name, null,
				function() {
					var result = RestApi.create('/fleet_groups.json', null, { fleet_group : $scope.item });

					result.$promise.then(
						function(data) {
							$scope.item = data;
							$scope.updateRelations();
						}, 
						function(error) {
							ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
						});
				}, 
				function(data) {
					ModalUtils.alert('sm', 'Error', 'Requested Data Already Exists!');
				},
				function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		};

		/**
		 * Multiple Update Geofence - Group Relations
		 */
		$scope.updateRelations = function() {
			$scope.refreshList();
			var items = $scope.buildRelations();
			$scope.invokeUpdateRelations(items);
		};

		/**
		 * Build Geofence - Group Relations Data for Multiple Update
		 */
		$scope.buildRelations = function() {
			var items = [];

			for (var i = 0; i < $scope.items.length; i++) {
				var relation = $scope.items[i];
				if (relation.geofence_id) {
					items.push({
						id: relation.id,
						fleet_group_id: $scope.item.id,
						geofence_id: relation.geofence_id,
						alarm_type: relation.alarm_type,
						_cud_flag_: (relation.deleteFlag) ? 'd' : (relation.id ? 'u' : 'c')
					});
				}
			}

			return items;
		};

		/**
		 * Invoke Geofence - Group Relation
		 */
		$scope.invokeUpdateRelations = function(relationItems) {
			if (relationItems.length > 0) {
				var url = '/geofence_groups/update_multiple.json';
				var result = RestApi.updateMultiple(url, null, relationItems);

				result.$promise.then(
					function(data) {
						$scope.searchGeoGroups();
						ModalUtils.success('Success', 'Success To Save');
					}, 
					function(error) {
						ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
					});
			} else {
				ModalUtils.success('Success', 'Success To Save');
			}
		};

		/**
		 * Delete
		 * 
		 * @return N/A
		 */
		$scope.delete = function() {
			if ($scope.item.id && $scope.item.id != '') {
				ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
					var result = RestApi.delete('/fleet_groups/' + $scope.item.id + '.json', null);
					result.$promise.then(
						function(data) {
							$scope.new();
							$scope.refreshList();
							ModalUtils.success('Success', 'Success To Delete');
						}, 
						function(error) {
							ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
						});
				});
			}
		};

		/**
		 * New
		 * 
		 * @return N/A
		 */
		$scope.new = function() {
			$scope.item = {};
			$scope.items = [];
		};

		/**
		 * Refresh Driver List
		 * 
		 * @return N/A
		 */
		$scope.refreshList = function() {
			$scope.$emit('setting-group-items-change', null);
		}

		/**
		 * add - Create
		 * 
		 * @return {Object}
		 */
		$scope.addRelation = function() {
			if(!$scope.geofences || $scope.geofences.length == 0) {
				$scope.searchGeofences();
			}
			
			$scope.items.push({
				no: 0,
				fleet_group : { id : $scope.item.id, name : $scope.item.name, description : $scope.item.description },
				fleet_group_id : $scope.item.id,
				alarm_type : '',
				geofence : { id : '', name : '', description : '' },
				geofence_id: '',
				isShow : true,
				deleteFlag : false
			});

			$scope.numbering($scope.items, 1);
		};

		/**
		 * Relation 삭제 
		 */
		$scope.deleteRelation = function() {
			for(var i = 0 ; i < $scope.items.length ; i++) {
				var item = $scope.items[i];
				if(item.deleteFlag) {
					item.isShow = false;
				}
			}
		};

		/**
		 * Check All
		 */
		$scope.checkAll = function() {
			angular.forEach($scope.items, function(item) {
				item.deleteFlag = true;
			});
		};

		/**
		 * group item selected
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var groupChangeListener = $rootScope.$on('setting-group-item-change', function(event, group) {
			$scope.item = group;
			$scope.searchGeoGroups();
			$scope.searchGeofences();
			GridUtils.setGridContainerHieght('setting-group-relation-table-container');
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    groupChangeListener();
	  });

	  GridUtils.setGridContainerHieght('setting-group-relation-table-container');
	  
		// --------------------------- E N D ----------------------------
	});