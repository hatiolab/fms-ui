/**
 * Get Transcluded content's change localed languege
 */
 angular.module('fmsCore')
 .directive('translate', ['FmsUtils','ModalUtils','RestApi', function (FmsUtils, ModalUtils,RestApi) {
  return { 
        restrict: 'E',
        transclude: true,
        scope: {
          nameParam:"=",
          nameValue:"@",
          category:"@",
          display:"@"
        },
        template: '<span ng-class ="isTranslated" ng-Dblclick="mLDescChange()">{{text}}</span>',
        controller: function($scope, $transclude, $element, $modal, $log, ModalUtils, $cookies) {

          this.translation = function(){
            $scope.nameParam = $scope.nameParam?$scope.nameParam:$scope.nameValue;

            if($scope.nameParam){
              $transclude(function(clone, scope) {
                  if(LOCALE_RESOURCE[$scope.category]){
                    $scope.text = LOCALE_RESOURCE[$scope.category][$scope.nameParam] ? LOCALE_RESOURCE[$scope.category][$scope.nameParam] : $scope.display;
                    $scope.text = $scope.text ? $scope.text : $scope.nameParam
                    if(LOCALE_RESOURCE[$scope.category][$scope.nameParam]){
                      // $scope.isTranslated ="text-success";
                    }else{
                      $scope.isTranslated ="text-danger";
                    }
                  }else{
                    $scope.text = $scope.display ? $scope.display : $scope.nameParam;
                    $scope.text = $scope.text ? $scope.text : $scope.nameParam
                    $scope.isTranslated ="text-danger";
                  }
              });
            }else{
               $scope.text = $scope.display ? $scope.display : $scope.nameParam;
               $scope.isTranslated ="text-danger";
            }
          }

          $scope.mLDescChange= function(){
            var local_res = {}
           // local_res = {type : $scope.type, name : $scope.name);
           //description, display(local languege), locale, name, category
           local_res = { category : $scope.category, name : $scope.nameParam, display:$scope.text, locale: $cookies.get('locale') };
           if(login.admin_flag){
              ModalUtils.change('large', 'Multilanguege Modifier','', local_res ,function(data){
                var url = '/dictionaries/upsert.json';
                var result = RestApi.update(url, null, {dictionary : local_res});
                   result.$promise.then(function(data) {
                      if(!LOCALE_RESOURCE[local_res.category]){
                        LOCALE_RESOURCE[local_res.category]={};
                      }
                      LOCALE_RESOURCE[local_res.category][local_res.name] =local_res.display;
                      $scope.text=local_res.display;
                      $scope.isTranslated ="";
                   });
              });
            }
          }

          // $scope.$on("start-multilangue-setting-mode", function () {
          //   this.translation();
          // })

          // $scope.$on("end-multilangue-setting-mode", function () {
          //   this.translation();
          //   $scope.isTranslated='';
          // })

        },
        link: function(scope, element, attrs, ctrl, transclude) {
          ctrl.translation();
          // scope.isTranslated='';
        }
    }
}])