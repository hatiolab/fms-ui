angular.module('fmsCore')
.directive('toggleSwitch', ['FmsUtils', function (FmsUtils) {
  return { 
    restrict: 'A',
    controller: function ($rootScope, $scope, $element){

      $scope.toggleSidebar = function() {
        var sidebar = angular.element(document.querySelector('[ui-view="sidebar-view"]'));

        if($rootScope.sidebarSwitch) {
          sidebar.show();
        } else {
          sidebar.hide();
        }
      }

      $scope.contentBarResize = function() {
        $("div.col-xs-8.col-md-8.content.padding-clear").toggleClass("width-full");
        $rootScope.$broadcast('content-view-resize');
      }

      $scope.$on("togglebar-change", function () {
        $scope.toggleSidebar();
        $scope.contentBarResize();
      });

      $scope.toggleSidebar();
    }
  };
}])