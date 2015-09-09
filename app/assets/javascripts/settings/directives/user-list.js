angular.module('fmsSettings').directive('userList', function() {
		return {
			restrict: 'E',
			controller: 'userListCtrl',
			templateUrl: '/assets/settings/views/contents/users.html',
			scope: {},
			link: function(scope, element, attr, userListCtrl) {
			}
		};
	})
	.controller('userListCtrl', function($rootScope, $scope, UserPopup, ModalUtils, GridUtils, FmsUtils, RestApi) {

		/**
		 * Selected Company
		 * 
		 * @type {Object}
		 */
		$scope.company = null;
		/**
		 * User List
		 *
		 * @type {Arrat}
		 */
		$scope.users = [];

		/**
		 * Search Users
		 */
		$scope.search = function() {
			$scope.doSearch(null, function(items) {
				$scope.numbering(items, 1);
				$scope.users = items;
				$scope.afterSearch(items);
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
				items[i].isShow = true;
			}
		};

		/**
		 * Search 
		 * 
		 * @param  {Object}
		 * @param  {Function}
		 * @return N/A
		 */
		$scope.doSearch = function(params, callback) {
			RestApi.list('/users.json', { '_q[domain_id-eq]' : $scope.company.id }, function(items) {
				callback(items);
			});
		};

		/**
		 * After Search
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.afterSearch = function(items) {
			// grid container를 새로 설정한다.
			GridUtils.setGridContainerHieght('setting-user-table-container');
		};

		/**
		 * Show user info to contents
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.goItem = function(group) {
			$scope.setActiveItem(group);
			$scope.$emit('setting-user-item-change', group);
		};

		/**
		 * active item
		 * 
		 * @param {Object}
		 */
		$scope.setActiveItem = function(activeItem) {
			for(var i = 0 ; i < $scope.users.length ; i++) {
				var item = $scope.users[i];
				item.active = (item.id == activeItem.id);
			}
		};

		/**
		 * Check All
		 */
		$scope.checkAll = function() {
			angular.forEach($scope.users, function(user) {
				user.deleteFlag = true;
			});
		};

		/**
		 * Remove User
		 */
		$scope.removeUser = function() {
			$scope.users.forEach(function(user) {
				if(user.deleteFlag) {
					user.isShow = false;
				}
			});
		};

	  /**
	   * New User Popup
	   */
		$scope.newUser = function() {
			if($scope.company) {
				var user = { id : '', login : '', name : '', email : '', password : '', password_confirmation : '', domain_id : $scope.company.id, domain_name : $scope.company.name, timezone : $scope.company.timezone };
				UserPopup.show(user);
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
		 * User Change Listener
		 * 
		 * @param  {Object} event
		 * @param  {Object} company
		 */
		var userChangeListener = $rootScope.$on('setting-company-item-change', function(event, company) {
			$scope.company = company;
			$scope.search();
		});

		/**
		 * Users changed so the list must be refreshed
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var usersChangeListener = $rootScope.$on('setting-user-items-change', function(event) {
			$scope.search();
		});

		/**
		 * User Clear Listener
		 * 
		 * @param  {Object} event
		 */
		var userClearListener = $rootScope.$on('setting-user-item-clear', function(event) {
			$scope.users = [];
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    userChangeListener();
	    usersChangeListener();
	    userClearListener();
	  });

	  /**
	   * 기본 그리드 Height 설정 
	   */
	  GridUtils.setGridContainerHieght('setting-user-table-container');
	  
		// ------------------------------ E N D -------------------------------------
	});