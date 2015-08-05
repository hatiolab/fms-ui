angular.module('fmsSettings').directive('groupDetail', function() { 
	return { 
		restrict: 'E',
		controller: 'groupDetailCtrl',
		templateUrl: '/assets/settings/views/contents/groups.html',
		scope: {}
	}; 
})
.controller('groupDetailCtrl', function($rootScope, $scope, $resource, $element, ModalUtils, FmsUtils, RestApi) {
	/**
	 * Selected Driver Item
	 * 
	 * @type {Object}
	 */
	$scope.item = {};

	/**
	 * group item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	$rootScope.$on('setting-group-item-change', function(event, group) {
		$scope.item = group;
		FmsUtils.setGridContainerHieght('setting-group-relation-table-container');
	});

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		if(!$scope.item.name || $scope.item.name == '') {
			return $scope.showAlerMsg('Name must not be empty!');
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
		if(!$scope.checkValidForm()) {
			return;
		}

		if($scope.item.id && $scope.item.id != '') {
			var url = '/fleet_groups/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, {driver : $scope.item});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});

		} else {
			var result = RestApi.create('/fleet_groups.json', null, {driver : $scope.item});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});
		}
	};

	/**
	 * Delete
	 * 
	 * @return N/A
	 */
	$scope.delete = function() {
		if(!$scope.item.id || $scope.item.id == '') {
			return;
		}

		ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
			var result = RestApi.delete('/fleet_groups/' + $scope.item.id + '.json', null);
			result.$promise.then(function(data) {
				$scope.new();
				$scope.refreshList();
			});
		});
	};

	/**
	 * New
	 * 
	 * @return N/A
	 */
	$scope.new = function() {
		$scope.item = {};
	};

	/**
	 * Refresh Driver List
	 * 
	 * @return N/A
	 */
	$scope.refreshList = function() {
		$scope.$emit('setting-group-items-change', null);
	}

	// --------------------------- E N D ----------------------------
});