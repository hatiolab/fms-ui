angular.module('fmsSettings').directive('driverDetail', function() { 
	return { 
		restrict: 'E',
		controller: 'driverDetailCtrl',
		templateUrl: '/assets/settings/views/contents/drivers.html',
		scope: {}
	}; 
})
.controller('driverDetailCtrl', function($rootScope, $scope, $element, Upload, FmsUtils, ModalUtils, RestApi) {

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
	$scope.item = { img : "" };

	/**
	 * File Object 변경시 자동 업로드 
	 * 
	 * @param  {file}
	 * @return N/A
	 */
	$scope.$watch('file', function (file) {
		if(file != null && $scope.item && $scope.item.id) {
			Upload.upload({
				url: '/drivers/' + $scope.item.id + '/upload_image.json', 
				file: file,
			}).progress(function(evt) {
			}).success(function(data, status, headers, config) {
				$scope.item.img = data.img;
			});
		}
  });

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		var form = $scope.driverSettingForm;
		var keys = ['ID', 'Name', 'email', 'Division', 'Social ID', 'Mobile', 'Title', 'Address'];

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
		var form = $scope.driverSettingForm;
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

			result.$promise.then(
				function(data) {
					$scope.refreshList();
					ModalUtils.success('Success', 'Success To Save');

				}, function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});

		} else {
			var result = RestApi.create('/drivers.json', null, {driver : $scope.item});

			result.$promise.then(
				function(data) {
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
			var result = RestApi.delete('/drivers/' + $scope.item.id + '.json', null);
			result.$promise.then(
				function(data) {
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
		$scope.item = { img : "" };
	};

	/**
	 * Refresh Driver List
	 * 
	 * @return N/A
	 */
	$scope.refreshList = function() {
		$scope.$emit('setting-driver-items-change', null);
	};

	/**
	 * driver item selected
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	var driverChangeListener = $rootScope.$on('setting-driver-item-change', function(event, driver) {
		$scope.item = driver;
		$scope.item.img = $scope.item.img ? $scope.item.img : "";
		$scope.file = null;
	});

  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    driverChangeListener();
  });		

	// --------------------------- E N D ----------------------------
});