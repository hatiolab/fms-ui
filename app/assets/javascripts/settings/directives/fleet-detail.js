angular.module('fmsSettings').directive('fleetDetail', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetDetailCtrl',
		templateUrl: '/assets/settings/views/contents/fleets.html',
		scope: {}
	}; 
})
.controller('fleetDetailCtrl', function($rootScope, $scope, $resource, $element, Upload, ModalUtils, RestApi) {

	/**
	 * File
	 * 
	 * @type {Object}
	 */
	$scope.file = null;
	/**
	 * Selected Driver Item
	 * 
	 * @type {Object}
	 */
	$scope.item = { image : '/assets/ph_car.png' };

	/**
	 * File Object 변경시 자동 업로드 
	 * 
	 * @param  {file}
	 * @return N/A
	 */
	$scope.$watch('file', function (file) {
		if(file != null && $scope.item && $scope.item.id) {
			Upload.upload({
				url: '/fleets/' + $scope.item.id + '/upload_image.json', 
				file: file,
			}).progress(function(evt) {
				//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				$scope.item.car_image = data.car_image;
			});
		}
  });

	/**
	 * change image
	 * 
	 * @param  {String}
	 * @return N/A
	 */
  $scope.changeImage = function(imageType) {
  	if(imageType == 'car') {
  		$scope.item.image = $scope.item.car_image ? $scope.item.car_image : "/assets/ph_car.png";
  	} else {
  		$scope.item.image = ($scope.item.driver && $scope.item.driver.img) ? $scope.item.driver.img : "/assets/ph_user.png";
  	}
  };

  $scope.setDefaultImage = function() {
		$scope.item.image = $scope.item.car_image ? $scope.item.car_image : "/assets/ph_car.png";
  };

	/**
	 * fleet item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	$rootScope.$on('setting-fleet-item-change', function(event, fleet) {
		$scope.item = fleet;
		$scope.setDefaultImage();
		$scope.file = null;
	});

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		if(!$scope.item.name || $scope.item.name == '') {
			return $scope.showAlerMsg('ID must not be empty!');
		}

		if(!$scope.item.driver || $scope.item.driver.id == '') {
			return $scope.showAlerMsg('Driver must not be empty!');
		}

		if(!$scope.item.car_no || $scope.item.car_no == '') {
			return $scope.showAlerMsg('Car No. must not be empty!');
		}

		if(!$scope.item.fleet_group || $scope.item.fleet_group.id == '') {
			return $scope.showAlerMsg('Group must not be empty!');
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
			var url = '/fleets/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, {driver : $scope.item});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});

		} else {
			var result = RestApi.create('/fleets.json', null, {driver : $scope.item});
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
			var result = RestApi.delete('/fleets/' + $scope.item.id + '.json', null);
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
		$scope.item = { image : '/assets/ph_car.png' };
	};

	/**
	 * Refresh Driver List
	 * 
	 * @return N/A
	 */
	$scope.refreshList = function() {
		$scope.$emit('setting-fleet-items-change', null);
	}

	// --------------------------- E N D ----------------------------
});