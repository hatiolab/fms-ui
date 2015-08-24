/**
 * period setting
 */
 angular.module('fmsCore')
 .directive('optionList', ['FmsUtils', function (FmsUtils, RestApi) {
  return { 
          restrict: 'E',
          scope:{
            optionModel : '=',
            optionName : '@'
          },
          controller: function ($scope,RestApi)
          {
              this.find = function(url,params) {
                  
                  RestApi.list('/'+url+'.json', params, function(dataSet) {
                    $scope.options = dataSet;
                });
              };
          },
          templateUrl: '/assets/core/views/option-list.html'
    }
}])
 .directive('groups', ['FmsUtils', function (FmsUtils) {

  return { 
          require:'^optionList',
          link: function (scope, element, attrs, optionListCtrl) {
            optionListCtrl.find('fleet_groups',null);
          }
    }
}])
;