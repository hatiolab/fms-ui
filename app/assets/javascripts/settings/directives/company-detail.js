angular.module('fmsSettings').directive('companyDetail', function() {
		return {
			restrict: 'E',
			controller: 'companyDetailCtrl',
			templateUrl: '/assets/settings/views/contents/company.html',
			scope: {},
			link: function(scope, element, attr, groupDetailCtrl) {}
		};
	})
	.controller('companyDetailCtrl', function($rootScope, $scope, $filter, $timeout, ModalUtils, GridUtils, RestApi) {

		/**
		 * System Domain
		 * 
		 * @type {Boolean}
		 */
		$scope.systemCompany = currentDomain.system_flag;
		/**
		 * Selected Company Item
		 * 
		 * @type {Object}
		 */
		$scope.item = {};
		/**
		 * Timezone
		 * 
		 * @type {Array}
		 */
		$scope.timezones = [];

		/**
		 * Form이 유효한 지 체크 
		 * 
		 * @return {Boolean}
		 */
		$scope.isFormValid = function() {
			return true;
		};

		/**
		 * 삭제 가능한 지 여부 
		 * 
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

			if (!$scope.item.name.length > 20) {
				return $scope.showAlerMsg('Max length of Name is 20!');
			}			

			if (!$scope.item.timezone || $scope.item.timezone == '') {
				return $scope.showAlerMsg('Timezone must not be empty!');
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
		 * Timezone List
		 * 
		 * @return {Array}
		 */
		$scope.timezoneList = function() {
			RestApi.list('/assets/core/views/timezone.json', null, function(dataSet) {
				$scope.timezones = dataSet;
			});			
		};

		/**
		 * Save - Create or Update
		 * 
		 * @return {Object}
		 */
		$scope.save = function() {
			if ($scope.checkValidForm()) {
				if ($scope.item.id && $scope.item.id != '') {
					$scope.update();
				} else {
					$scope.create();
				}
			}
		};

		/**
		 * Update Company
		 */
		$scope.update = function() {
			var url = '/domains/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, { domain : $scope.item });

			result.$promise.then(
				function(data) {
					$scope.showAlerMsg('Completed!');
					$scope.refreshList();
				}, 
				function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		};

		/**
		 * Create Company
		 */
		$scope.create = function() {
			ModalUtils.confirm('sm', 'Create Company', 'Are you sure to create?', $scope.createCompany);
		};

		/**
		 * Create Company
		 */
		$scope.createCompany = function() {
			RestApi.checkUnique('/domains/show_by_name.json?name=' + $scope.item.name, null,
				$scope.invokeCreate, 
				function(data) { 
					ModalUtils.alert('sm', 'Error', 'Requested Data Already Exists!'); 
				},
				function(error) { 
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText); 
				});
		};

		/**
		 * Invoke Create API
		 */
		$scope.invokeCreate = function() {
			var result = RestApi.create('/domains.json', null, { domain : $scope.item });
			var modalInst = ModalUtils.alert('sm', 'Info', 'Creating domain now. This will take a little time...'); 

			result.$promise.then(
				function(data) {
					$scope.item = data;
					$scope.refreshList();
					modalInst.dismiss('cancel');
					$scope.showAlerMsg('Completed!');
				}, 
				function(error) {
					modalInst.dismiss('cancel');
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		};

		/**
		 * Delete Company
		 * 
		 * @return N/A
		 */
		$scope.delete = function() {
			if ($scope.item.id && $scope.item.id != '') {
				ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
					var result = RestApi.delete('/domains/' + $scope.item.id + '.json', null);
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
		 * New Company
		 * 
		 * @return N/A
		 */
		$scope.new = function() {
			$scope.item = {};
			$scope.$emit('setting-user-item-clear', null);
		};

		/**
		 * Refresh Company List
		 * 
		 * @return N/A
		 */
		$scope.refreshList = function() {
			$scope.$emit('setting-company-items-change', null);
		};

		/**
		 * Item Change Listener
		 * 
		 * @param  {Object} event
		 * @param  {Object} company)
		 */
		var itemChangeListener = $rootScope.$on('setting-company-item-change', function(event, company) {
			$scope.item = company;
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	  	itemChangeListener();
	  });

	  /**
	   * Get Timezone list
	   */
	  $scope.timezoneList();

		// --------------------------- E N D ----------------------------
	});