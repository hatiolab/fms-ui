/**
 * period setting
 */
 angular.module('fmsCore')
  .directive('trxButton', ['RestApi', function (RestApi) {
  
    return { 
      restrict: 'E',
      scope: { optionModel : '=', optionName : '@' },
      controller: function ($scope, RestApi) {
        this.find = function(url, params) {
          RestApi.list('/' + url + '.json', params, function(dataSet) {
            $scope.options = dataSet;
          });
        };
      }
    };

}])
  .directive('newButton', [function () {

    return { 
      require : '^trxButton',
      link : function (scope, element, attrs, ctrl) {
        ctrl.find('common_codes/show_by_name', { name : 'DATE_FORMAT' });
      },
      template : '<button type="button" class="btn btn-default margin-t7 pull-left" ng-click="new()">New</button>'
    };

}])

  .directive('saveButton', [function () {

    return { 
      require : '^trxButton',
      link : function (scope, element, attrs, ctrl) {
        ctrl.find('common_codes/show_by_name', { name : 'TIME_FORMAT' });
      },
      template : '<button type="button" class="btn btn-default margin-t7 pull-right" ng-click="delete()">Delete</button>'
    };

}])
  .directive('deleteButton', [function () {

    return { 
      require : '^trxButton',
      link : function (scope, element, attrs, ctrl) {
        ctrl.find('common_codes/show_by_name', { name : 'TIME_FORMAT' });
      },
      template : '<button type="button" class="btn btn-default margin-t7 pull-right" ng-click="delete()">Delete</button>'
    };

}]);