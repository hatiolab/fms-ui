angular.module('fmsCore').controller('ModalPopupCtrl', function($rootScope, $scope, $modalInstance, showCancelButton, title, msg) {

	/**
	 * Show cancel button
	 * 
	 * @type {Boolean}
	 */
	$scope.showCancelButton = showCancelButton;
	/**
	 * Title of modal
	 * 
	 * @type {String}
	 */
	$scope.title = title;
	/**
	 * Message of modal
	 * 
	 * @type {String}
	 */
	$scope.msg = msg;

	/**
	 * OK Button Click시 
	 * 
	 * @return N/A
	 */
  $scope.ok = function () {
    $modalInstance.close();
  };

	/**
	 * Cancel Button Click시 
	 * 
	 * @return N/A
	 */
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});