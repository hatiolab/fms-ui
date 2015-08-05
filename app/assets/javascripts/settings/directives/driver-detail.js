angular.module('fmsSettings').directive('driverDetail', function() { 
	return { 
		restrict: 'E',
		controller: 'driverDetailCtrl',
		templateUrl: '/assets/settings/views/contents/drivers.html',
		scope: {}
	}; 
})
.controller('driverDetailCtrl', function($rootScope, $scope, $resource, $element, ModalUtils, RestApi) {

	/**
	 * Selected Driver Item
	 * 
	 * @type {Object}
	 */
	$scope.item = {};

	/**
	 * driver item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	$rootScope.$on('setting-driver-item-change', function(event, driver) {
		$scope.item = driver;
	});

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		if(!$scope.item.code || $scope.item.code == '') {
			return $scope.showAlerMsg('Code must not be empty!');
		}

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
		ModalUtils.alert('sm', 'Alert', 'Name must not be empty!');
		return false;
	};

	/**
	 * save
	 * 
	 * @return {Object}
	 */
	$scope.save = function() {
		if(!$scope.checkValidForm()) {
			return;
		}

		if($scope.item.id && $scope.item.id != '') {
			var url = '/drivers/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, {driver : $scope.item});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});

		} else {
			var result = RestApi.create('/drivers.json', null, {driver : $scope.item});
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
			var result = RestApi.delete('/drivers/' + $scope.item.id + '.json', null);
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
		$scope.$emit('setting-driver-items-change', null);
	}

	// --------------------------- E N D ----------------------------
});