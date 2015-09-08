angular.module('fmsGeofence').directive('relationDetail', function() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'relationDetailCtrl',
		templateUrl: '/assets/geofence/views/contents/relations.html',
		scope: {}
	};
})

.controller('relationDetailCtrl', function($rootScope, $scope, $state, $element, $filter, GridUtils, ModalUtils, FmsUtils, RestApi) {
	/**
	 * Selected Geofence Item
	 * 
	 * @type {Object}
	 */
	$scope.item = {};
	/**
	 * Geofence - Group List
	 */
	$scope.items = [];
	/**
	 * Group List
	 */
	$scope.groups = [];

	/**
	 * Search Geofence-Groups Relations
	 */
	$scope.searchGeoGroups = function() {

		var searchParams = {
			'_o[fleet_group_id]': 'asc',
			"_q[geofence_id-eq]" : $scope.item.id
		};

		RestApi.list('/geofence_groups.json', searchParams, function(dataList) {
			$scope.numbering(dataList, 1);
			$scope.items = dataList;
		});
	};

	/**
	 * Search fleet groups
	 */
	$scope.searchGroups = function() {
		RestApi.list('/fleet_groups.json', {}, function(dataList) {
			$scope.groups = dataList;
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
			item.deleteFlag = false;
			item.isShow = true;
		}
	};

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		var form = $scope.geofenceRelationSettingForm;
		var keys = ['Name', 'Description'];
		var valid = true;

		for(var i = 0 ; i < keys.length ; i++) {
			var input = form[keys[i]];
			if(input) {
				if(!FmsUtils.isEmpty(input.$error)) {
					if(input.$error.required) {
						valid = $scope.showAlerMsg(input.$name + ' must not be empty!');
					} else if(input.$error.maxlength) {
						valid = $scope.showAlerMsg(input.$name + ' value length is over max length!');
					} else if(input.$error.minlength) {
						valid = $scope.showAlerMsg(input.$name + ' value length is under min length!');
					}	else if(input.$error.email) {
						valid = $scope.showAlerMsg(input.$name + ' value is invalid email format!');
					}
				}
			}
		}

		return valid ? $scope.checkRelations() : false;
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

			if(!relation.fleet_group_id || relation.fleet_group_id == '') {
				return $scope.showAlerMsg('Group must not be empty!');
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
			var keyValue = item.fleet_group_id + '-' + item.alarm_type;
			if(groups.indexOf(keyValue) >= 0) {
				return $scope.showAlerMsg('Same Group & Event is not allowed!');
			}

			groups.push(keyValue);
  	}
  
  	return true;
	};

	/**	
	 * Form이 유효한 지 체크 
	 * 
	 * @return {Boolean}
	 */
	$scope.isFormValid = function() {
		var form = $scope.geofenceRelationSettingForm;
		if(!form) {
			return false;
		} else {
			return form.$dirty;
		}
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
				$scope.updateGeofence();
			} else {
				$scope.createGeofence();
			}
		}
	};

	/**
	 * Update Geofence
	 */
	$scope.updateGeofence = function() {
		var url = '/geofences/' + $scope.item.id + '.json';
		var result = RestApi.update(url, null, { geofence: $scope.item });
		result.$promise.then(
			function(data) { 
				$scope.item = data; 
				$scope.updateRelations(); 
			}, 
			function(error) {
				ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
			}
		);
	};

	/**
	 * Create Geofence
	 */
	$scope.createGeofence = function() {
		RestApi.checkUnique('/geofences/show_by_name.json?name='+$scope.item.name,null,
			function() {
				var result = RestApi.create('/geofences.json', null, { geofence: $scope.item });
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
			if (relation.fleet_group_id) {
				items.push({
					id: relation.id,
					fleet_group_id: relation.fleet_group_id,
					geofence_id: $scope.item.id,
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
					ModalUtils.success('Success', 'Success To Save');
					$scope.searchGeoGroups();
					$scope.$emit('geofence-items-change', data);
				}, 
				function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
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
				var result = RestApi.delete('/geofences/' + $scope.item.id + '.json', null);
				
				result.$promise.then(
					function(data) {
						ModalUtils.success('Success', 'Success To Delete');
						$scope.new();
						$scope.refreshList();
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
	 * Refresh Geofence List
	 * 
	 * @return N/A
	 */
	$scope.refreshList = function() {
		$scope.$emit('geofence-items-change', null);
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
	 * Relation 추가 
	 * 
	 * @return {Object}
	 */
	$scope.addRelation = function() {
		if(!$scope.groups || $scope.groups.length == 0) {
			$scope.searchGroups();
		}

		$scope.items.push({
			no: 0,
			fleet_group : { id : '', name : '', description : '' },
			fleet_group_id : '',
			alarm_type : '',
			geofence : { id : $scope.item.id, name : $scope.item.name, description : $scope.item.description },
			geofence_id: $scope.item.id,
			isShow : true,
			deleteFlag : false
		});

		$scope.numbering($scope.items, 1);
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
	 * Back
	 */
	$scope.back = function() {
		$state.go('geofence.settings', { 'geofence': $scope.item }, { reload : true });
	};

	/**
	 * group item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	var geofenceChangeListener = $rootScope.$on('geofence-item-selected', function(event, item) {
		$scope.item = item;
		$scope.searchGroups();
		$scope.searchGeoGroups();
		GridUtils.setGridContainerHieght('geofence-relation-table-container');
	});

  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    geofenceChangeListener();
  });

  /**
   * 기본 테이블 Height 설정 
   */
	GridUtils.setGridContainerHieght('geofence-relation-table-container');

	//--------------------------------- E N D ------------------------------------
});