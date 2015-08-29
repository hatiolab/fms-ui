/**
 * period setting
 */
 angular.module('fmsCore')
  .directive('codeList', ['RestApi', function (RestApi) {
  
    return { 
      restrict: 'E',
      scope: { optionModel : '=', optionName : '@' },
      controller: function ($scope, RestApi) {
        this.find = function(url, params) {
          RestApi.list('/' + url + '.json', params, function(dataSet) {
            $scope.options = dataSet;
          });
        };
      },
      templateUrl: '/assets/core/views/code-list.html'
    };

}])
  .directive('dateformat', [function () {

    return { 
      require : '^codeList',
      link : function (scope, element, attrs, ctrl) {
        ctrl.find('common_codes/show_by_name', { name : 'DATE_FORMAT' });
      }
    };

}])

  .directive('timeformat', [function () {

    return { 
      require : '^codeList',
      link : function (scope, element, attrs, ctrl) {
        ctrl.find('common_codes/show_by_name', { name : 'TIME_FORMAT' });
      }
    };

}]);