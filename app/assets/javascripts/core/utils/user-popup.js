angular.module('fmsCore').factory('UserPopup', function($modal, $log) {

  return {
    show : function(user) {
      var modalInstance = $modal.open({
        animation : true,
        templateUrl : '/assets/core/views/user-popup.html',
        controller : 'UserPopupCtrl',
        size : 'large',
        resolve : {
          showCancelButton : function() { return true },
          title : function() { return 'User' },
          user : function() { return user }
        }
      });

      modalInstance.result.then(function() {
        console.log($modal);
      });
    }
  }
})
.controller('UserPopupCtrl', function($scope, $modalInstance, ModalUtils, FmsUtils, RestApi, user) {

  /**
   * User
   * 
   * @type {Object}
   */
  $scope.user = user;

  /**
   * OK Button Click시 
   * 
   * @return N/A
   */
  $scope.ok = function () {
    if($scope.user.id && $scope.user.id != '') {
      $scope.updateUser($scope.afterSaveSuccess);
    } else {
      $scope.createUser($scope.afterSaveSuccess);
    }
  };

  /**
   * After Save Success
   */
  $scope.afterSaveSuccess = function() {
    $modalInstance.close();
    $scope.$emit('setting-user-items-change', $scope.user);
  };

  /**
   * Cancel Button Click시 
   * 
   * @return N/A
   */
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  /**
   * Create User
   * 
   * @param  {Object} user
   */
  $scope.createUser = function(callback) {
    if($scope.checkValidUserForm(true)) {
      var result = RestApi.create('/users/create.json', null, { 'user' : $scope.user });
      result.$promise.then(
        function(data) {
          $scope.showAlerMsg('Success To Save');
          callback();
        }, 
        function(error) {
          RestApi.handleError(error);
        });
    }
  };

  /**
   * Update User
   * 
   * @param  {Object} user
   */
  $scope.updateUser = function() {
    if($scope.checkValidUserForm(false)) {
      var result = RestApi.update('/users/' + $scope.user.id + '.json', null, { 'user' : $scope.user });
      result.$promise.then(
        function(data) {
          $scope.showAlerMsg('Success To Save');
          callback();
        }, 
        function(error) {
          RestApi.handleError(error);
        });
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
   * Check form validation
   * 
   * @return N/A
   */
  $scope.checkValidUserForm = function(checkPassword) {
    var form = $scope.singupForm;
    var keys = ['Name', 'email'];

    if(checkPassword) {
      keys.push('Password');
      keys.push('Password Confirmation');
    }

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
          } else if(input.$error.email) {
            return $scope.showAlerMsg(input.$name + ' value is invalid email format!');
          }
        }
      }
    }

    if(checkPassword && ($scope.user.password != $scope.user.password_confirmation)) {
      return $scope.showAlerMsg('Mismatch - Password and Password Confirmation');
    }

    return true;
  }; 

  /**
   * Check Unique Email
   * 
   * @param  {Object}
   * @return {Boolean}
   */
  $scope.checkUniqueEmail = function(user) {
    var form = $scope.singupForm;
    
    if(user.email == '' || form['email'].$error.email) {
      return ModalUtils.alert('sm', 'Alert', 'email value is invalid email format!');

    } else {
      RestApi.get('/users/exists.json', { 'email' : user.email },
        function(data) {
          if(data.id) {
            $scope.showAlerMsg('This email is already used by another user!');
            user.email = '';
          } else {
            $scope.showAlerMsg('You can use this email');
          }
        });
    }
  };

});
