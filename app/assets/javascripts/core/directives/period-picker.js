/**
 * period setting
 */
 angular.module('fmsCore')
 .directive('periodPicker', ['FmsUtils', '$filter', function (FmsUtils, $filter) {

  return { 
    restrict: 'E',
    scope : {
      fromDate : '=',
      toDate : '=',
      search : '='
    },
    controller: function ($scope) {
      $scope.fromDt = { opened : false };
      $scope.toDt = { opened : false };
      $scope.format = 'yyyy-MM-dd';

      $scope.clear = function () {
        $scope.dt = null;
      };

      $scope.open = function(name, $event) {
        if(name == "fromDate") {
          $scope.fromDt.opened = true;
        } else if(name == "toDate") {
          $scope.toDt.opened = true;
        }
      };
    },
    templateUrl: '/assets/core/views/period-picker.html'
  };

}])

 angular.module('fmsCore')
 .directive('datePicker', ['FmsUtils', '$filter', function (FmsUtils, $filter) {

  return { 
    restrict: 'E',
    scope : {
      dateModel : '=',
      search : '='
    },
    controller: function ($scope) {
      $scope.dt = { opened : false };
      $scope.format = 'yyyy-MM-dd';

      // $scope.clear = function () {
      //   $scope.dt = null;
      // };

      $scope.open = function(name, $event) {
          $scope.dt.opened = true;
      };
    },
    templateUrl: '/assets/core/views/date-picker.html'
  };

}])

.directive('periodSet', ['FmsUtils', function (FmsUtils) {
  return {
    restrict: 'E',
    scope : {
      fromDate : '=',
      toDate : '=',
      search : '='
    },
    controller: function ($scope) {
      this.setSearchPeriod = function(periodType) {
        period = FmsUtils.getPeriodString(periodType);
        $scope.fromDate = period[0];
        $scope.toDate = period[1];
        if(angular.isFunction($scope.search)) {
          $scope.search();
        }
      }
    }
  };
}])

.directive('week', ['FmsUtils', function (FmsUtils) {
  return {
    require : "^periodSet",
    link: function (scope, element, attrs, periodSetCtrl) {
      var refreshButton = element.find('#priodsetWeek');
      refreshButton.bind("click", function() {
        periodSetCtrl.setSearchPeriod('week');
      });
    },
    templateUrl: '/assets/core/views/period-set-week.html'
  };
}])

.directive('month', ['FmsUtils', function (FmsUtils) {
  return {
    require : "^periodSet",
    link: function (scope, element, attrs, periodSetCtrl) {
      var refreshButton = element.find('#priodsetMonth');

      refreshButton.bind("click", function() {
        periodSetCtrl.setSearchPeriod('month');
      });
    },
    templateUrl: '/assets/core/views/period-set-month.html'
  };
}])

.directive('year', ['FmsUtils', function (FmsUtils) {
  return {
    require : "^periodSet",
    link: function (scope, element, attrs, periodSetCtrl) {
      var refreshButton = element.find('#priodsetYear');

      refreshButton.bind("click", function() {
        periodSetCtrl.setSearchPeriod('year');
      });
    },
    templateUrl: '/assets/core/views/period-set-year.html'
  };
}]);