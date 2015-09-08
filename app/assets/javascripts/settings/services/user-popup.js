angular.module('fmsSettings').factory('UserPopup', function($modal, $log) {

  return {
    show : function(user, callback) {
      var modalInstance = $modal.open({
        animation : true,
        templateUrl : '/assets/settings/views/contents/user-popup.html',
        controller : 'UserPopupCtrl',
        size : 'large',
        resolve : {
          showCancelButton : function() { return true },
          title : function() { return 'User' },
          user : function() { return user }
        }
      });

      modalInstance.result.then(function() {
        if(callback)
          callback(user);
      });
    }
  }
})
.controller('UserPopupCtrl', function($rootScope, $scope, $modalInstance) {

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
