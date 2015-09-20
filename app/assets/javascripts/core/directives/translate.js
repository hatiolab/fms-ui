/**
 * Get Transcluded content's change localed languege
 */
 angular.module('fmsCore')
 .directive('translate', ['ModalUtils','RestApi', function (ModalUtils, RestApi) {
  
  return { 
    restrict : 'E',
    transclude : true,
    scope : {
      nameParam : "=",
      nameValue : "@",
      category : "@",
      display : "@",
      watchRequire : "@"
    },
    
    template: '<span ng-class ="isTranslated" ng-Dblclick="mLDescChange()">{{text}}</span>',
    
    controller: function($rootScope, $scope, $transclude, $element, $modal, ModalUtils) {

      this.translation = function() {
        $scope.nameParam = $scope.nameParam ? $scope.nameParam : $scope.nameValue;

        if($scope.nameParam) {
          $transclude(function(clone, scope) {
            if(LOCALE_RESOURCE[$scope.category]) {
              $scope.text = LOCALE_RESOURCE[$scope.category][$scope.nameParam] ? LOCALE_RESOURCE[$scope.category][$scope.nameParam] : $scope.display;
              $scope.text = $scope.text ? $scope.text : $scope.nameParam
              
              if(LOCALE_RESOURCE[$scope.category][$scope.nameParam]) {
                // $scope.isTranslated ="text-success";
              } else {
                if(LANG_SETUP=='Y'){
                  $scope.isTranslated ="text-danger";
                }
              }
            } else {
              $scope.text = $scope.display ? $scope.display : $scope.nameParam;
              $scope.text = $scope.text ? $scope.text : $scope.nameParam
              if(LANG_SETUP=='Y'){
                  $scope.isTranslated ="text-danger";
              }
            }
          });
        } else {
          $scope.text = $scope.display ? $scope.display : $scope.nameParam;
          if(LANG_SETUP=='Y'){
              $scope.isTranslated ="text-danger";
          }
        }
      }

      $scope.mLDescChange = function() {
        var localeData = { category : $scope.category, name : $scope.nameParam, display : $scope.text, locale : login.locale };
        
        if(login.admin_flag&& LANG_SETUP=='Y') {
          ModalUtils.change('large', '', '', localeData ,function(data) {
          var url = '/dictionaries/upsert.json';

          var result = RestApi.update(url, null, { dictionary : localeData });
          result.$promise.then(
            function(data) {
              if(!LOCALE_RESOURCE[localeData.category]) {
                LOCALE_RESOURCE[localeData.category] = {};
              }
              
              LOCALE_RESOURCE[localeData.category][localeData.name] = localeData.display;
              $scope.text = localeData.display;
              $scope.isTranslated = "";
            });
          });
        }
      }

      /**
       * 키가 변경이 될 수 있는 경우 : watchRequire
       */
      if($scope.watchRequire && $scope.watchRequire == 'Y') {
        $scope.tran = this.translation;
        $scope.$watch('nameParam', function() { $scope.tran(); });
      }

      /*$scope.$on("start-multilangue-setting-mode", function () {
        this.translation();
      })

      $scope.$on("end-multilangue-setting-mode", function () {
        this.translation();
        $scope.isTranslated='';
      });*/
    },
        
    link : function(scope, element, attrs, ctrl, transclude) {
      ctrl.translation();
    }

  };
}])