angular.module('fmsSettings').directive('companyDetail', function() {
		return {
			restrict: 'E',
			controller: 'companyDetailCtrl',
			templateUrl: '/assets/settings/views/contents/company.html',
			scope: {},
			link: function(scope, element, attr, groupDetailCtrl) {}
		};
	})
	.controller('companyDetailCtrl', function($rootScope, $scope, $filter, ModalUtils, GridUtils, RestApi) {

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
					$scope.update();
				} else {
					$scope.create();
				}
			}
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
		 * Update Company
		 */
		$scope.update = function() {
			var url = '/domains/' + $scope.item.id + '.json';
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
		 * Create Company
		 */
		$scope.create = function() {
			RestApi.checkUnique('/domains/show_by_name.json?name=' + $scope.item.name, null,
				function() {
					var result = RestApi.create('/domains.json', null, { fleet_group : $scope.item });

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
		 * Delete
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
		 * New
		 * 
		 * @return N/A
		 */
		$scope.new = function() {
			$scope.item = {};
		};

		/**
		 * Refresh Company List
		 * 
		 * @return N/A
		 */
		$scope.refreshList = function() {
			$scope.$emit('setting-company-items-change', null);
		}

		/**
		 * Add User
		 * 
		 * @return {Object}
		 */
		$scope.addUser = function() {
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
		 * Delete User 
		 */
		$scope.deleteUser = function() {
			for(var i = 0 ; i < $scope.items.length ; i++) {
				var item = $scope.items[i];
				if(item.deleteFlag) {
					item.isShow = false;
				}
			}
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