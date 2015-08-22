/**
 * period setting
 */
 angular.module('fmsCore')
 .directive('periodPicker', ['FmsUtils', function (FmsUtils) {

  return { restrict: 'E',
           scope :
           {
             fromDate : '=',
             toDate : '=',
             search : '='
           },
          controller: function ($scope)
          {
              /**
               * data picker init
               */
              $(function() {
                var datePick = $('#fromdatepicker').datetimepicker({
                  language : 'en',
                  pickTime : false,
                  autoclose : true
                })
                .on('changeDate', function(fev) {
                  $scope.fromDate = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
                  datePick.data('datetimepicker').hide();
                  if(typeof $scope.search == 'function'){
                     $scope.search();
                  }
                });
              });
      
              $(function() {
                var datePick = $('#todatepicker').datetimepicker({
                  language : 'en',
                  pickTime : false,
                  autoclose : true
                })
                .on('changeDate', function(fev) {
                  $scope.toDate = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd'); 
                  datePick.data('datetimepicker').hide();
                  if(typeof $scope.search == 'function'){
                     $scope.search();
                  }
                });
              });
          },
          templateUrl: '/assets/core/views/period-picker.html'
    }
}])

.directive('periodSet', ['FmsUtils', function (FmsUtils) {
  return {
          restrict: 'E',
           scope :
           {
             fromDate : '=',
             toDate : '=',
             search : '='
           },
          controller: function ($scope)
          {
            this.setSearchPeriod = function(periodType){
              period = FmsUtils.getPeriodString(periodType);
              $scope.fromDate = period[0];
              $scope.toDate = period[1];
              if(angular.isFunction($scope.search)){
                     $scope.search();
              }
            }
          }
    }
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
    }
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
    }
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
    }
}])
;