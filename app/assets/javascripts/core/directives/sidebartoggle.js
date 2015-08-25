angular.module('fmsCore')
 .directive('toggleSwitch', ['FmsUtils', function (FmsUtils) {
  return { 
          restrict: 'A',
          controller: function ($rootScope, $scope,$element){

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
            }


            $scope.$on("togglebar-change", function () {
              $scope.toggleSidebar();
              $scope.contentBarResize();
            });

            $scope.toggleSidebar();
/**
 *       var documentResult = document.getElementsByClassName("multi-files");
      console.log('document.getElementsByClassName: ', documentResult);
      
      var wrappedDocumentResult = angular.element(documentResult);
      console.log('angular.element: ', wrappedDocumentResult);
      
      var elementResult = element[0].getElementsByClassName('multi-files');
      console.log('element[0].getElementsByClassName: ', elementResult);
      
      var wrappedElementResult = angular.element(elementResult);
      console.log('angular.element: ', wrappedElementResult);
      
      var queryResult = element[0].querySelector('.multi-files');
      console.log('element[0].querySelector: ', queryResult);
      
      var wrappedQueryResult = angular.element(queryResult);
      console.log('angular.element: ', wrappedQueryResult);
 */
          }
    }
}])