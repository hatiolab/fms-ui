angular.module('fmsSettings').directive('fleetDetail', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetDetailCtrl',
		templateUrl: '/assets/settings/views/contents/fleets.html',
		scope: {}
	}; 
})
.controller('fleetDetailCtrl', function($rootScope, $scope, $resource, $element, Upload, ModalUtils, FmsUtils, RestApi) {

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
	$scope.item = { image : '' };

	 /**
	  * Date Picker Handling
	  * 
	  * @param  {[type]}
	  * @return {[type]}
	  */
	 $(function() {
	 	var purchaseDate = $('#setting_fleet_datepicker1').datetimepicker({
	 		language : 'en',
	 		pickTime : false,
	 		autoclose : true
	 	}).on('changeDate', function(fev) {
	 		$scope.item["purchase_date"] = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
	 		purchaseDate.data('datetimepicker').hide();
	 	});
	 });

	 $(function() {
	 	var regDate = $('#setting_fleet_datepicker2').datetimepicker({
	 		language : 'en',
	 		pickTime : false,
	 		autoclose : true
	 	}).on('changeDate', function(tev) {
	 		$scope.item["reg_date"] = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
	 		regDate.data('datetimepicker').hide();
	 	});
	 });	

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
			}).success(function(data, status, headers, config) {
				$scope.item.car_image = data.car_image;
				$scope.item.image = data.car_image;
			});
		}
  	});

	/**
	 * Search Fleet Groups
	 */
	$scope.findGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
	};
	/**
	 * Search Drivers
	 */
	$scope.findDrivers = function(params) {
		RestApi.list('/drivers.json', params, function(dataSet) {
			$scope.drivers = dataSet;
		});
	};
	/**
	 * change image
	 * 
	 * @param  {String}
	 * @return N/A
	 */
  $scope.changeImage = function(imageType) {
  	if(imageType == 'car') {
  		$scope.item.image = $scope.item.car_image ? $scope.item.car_image : "";
  	} else {
  		$scope.item.image = ($scope.item.driver && $scope.item.driver.img) ? $scope.item.driver.img : "";
  	}
  };

  $scope.setDefaultImage = function() {
		$scope.item.image = $scope.item.car_image ? $scope.item.car_image : "";
  };

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		var form = $scope.fleetSettingForm;
		var keys = ['ID', 'Driver', 'Car No', 'Group', 'Car Model', 'Device Name', 'Device Model'];

		for(var i = 0 ; i < keys.length ; i++) {
			var input = form[keys[i]];
			if(input) {
				if(!FmsUtils.isEmpty(input.$error)) {
					if(input.$error.required) {
						return $scope.showAlerMsg(input.$name + ' must not be empty!');
					} else if(input.$error.maxlength) {
						return $scope.showAlerMsg(input.$name + ' value length is over max length!');
					} else if(input.$error.minlength) {
						return $scope.showAlerMsg(input.$name + ' value length is under min length!');
					}	else if(input.$error.email) {
						return $scope.showAlerMsg(input.$name + ' value is invalid email format!');
					}
				}
			}
		}

		return true;		
	};

	/**
	 * Form이 유효한 지 체크 
	 * @return {Boolean}
	 */
	$scope.isFormValid = function() {
		var form = $scope.fleetSettingForm;
		if(!form){
			return false;
		}else{
			//return form.$dirty && form.$valid;
			return form.$dirty;
		}
	};

	/**
	 * 삭제 가능한 지 여부 
	 * @return {Boolean}
	 */
	$scope.isDeletable = function() {
		return $scope.item.id ? true : false;
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
			var result = RestApi.update(url, null, {fleet : $scope.item});

			result.$promise.then(function(data) {
				$scope.refreshList();
				ModalUtils.success('Success', 'Success To Save');

			}, function(error) {
				ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
			});

		} else {
			$scope.item.lat = DEFAULT_LAT;
			$scope.item.lng = DEFAULT_LNG;
			$scope.item.status = 'OFF';
			$scope.item.velocity = 0;

			var result = RestApi.create('/fleets.json', null, { fleet : $scope.item });
			result.$promise.then(function(data) {
				$scope.refreshList();
				ModalUtils.success('Success', 'Success To Save');

			}, function(error) {
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
		if(!$scope.item.id || $scope.item.id == '') {
			return;
		}

		ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
			var result = RestApi.delete('/fleets/' + $scope.item.id + '.json', null);
			result.$promise.then(function(data) {
				$scope.new();
				$scope.refreshList();
				ModalUtils.success('Success', 'Success To Delete');

			}, function(error) {
				ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
			});
		});
	};

	/**
	 * New
	 * 
	 * @return N/A
	 */
	$scope.new = function() {
		$scope.item = { image : '' };
	};

	/**
	 * Refresh Driver List
	 * 
	 * @return N/A
	 */
	$scope.refreshList = function() {
		$scope.$emit('setting-fleet-items-change', null);
	};

	/**
	 * fleet item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	var fleetChangeListener = $rootScope.$on('setting-fleet-item-change', function(event, fleet) {
		$scope.item = fleet;
		$scope.setDefaultImage();
		$scope.findGroups();
		$scope.findDrivers();
		$scope.file = null;
	});	

  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    fleetChangeListener();
  });

  $scope.init= function(){
	$scope.setDefaultImage();
	$scope.findGroups();
	$scope.findDrivers();
	$scope.file = null;
  }

  $scope.init();
	// --------------------------- E N D ----------------------------
});