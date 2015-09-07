/**
 * lrInfiniteScrollPlugin
 */
 angular.module('smart-table')
 .directive('stPaginationScroll', ['$timeout', 'GridUtils', function (timeout, GridUtils) {

  return {

    require: 'stTable',

    link: function (scope, element, attr, ctrl) {
     /**
      * 그리드가 가질 수 있는 최대 버퍼 사이즈 
      * 
      * @type {Number}
      */
      var gridBufferCount = GridUtils.getGridBufferCount();
      var itemByPage = GridUtils.getGridCountPerPage();
      var lengthThreshold = GridUtils.getGridLengthThreshold();
      var timeThreshold = GridUtils.getTimeThreshold();
      var pagination = ctrl.tableState().pagination;
      var moveScrollPx = 500;

      /**
       * Items Numbering
       * 
       * @param  {Array}
       * @return N/A
       */
       var itemNumbering = function(scrollUp, items) {
        var startNo = 1;

        if(scope.items && scope.items.length > 0) {
          startNo = scrollUp ? (scope.items[0].no - itemByPage) : (scope.items[scope.items.length - 1].no + 1);
        }

        for(var i = 0 ; i < items.length ; i++) {
          items[i].no = startNo++;
        }
      };

      /**
       * pagination search
       * 
       * @param  {Boolean}
       * @param  {Start}
       * @param  {Limit}
       * @return N/A
       */
      var searchByPage = function(scrollUp, start, limit) {
        if(!scrollUp && (scope.items.length == 0 || scope.items[scope.items.length - 1].no >= pagination.totalItemCount)) {
          return;
        } 

        if(scrollUp && (scope.items.length == 0 || scope.items[0].no == 1)) {
          return;
        }

        var searchParams = scope.beforeSearch();
        scope.setPageQueryInfo(searchParams, pagination, start, limit);

        scope.doSearch(searchParams, function(dataSet) {
          itemNumbering(scrollUp, dataSet.items);

          if(!scrollUp) {
            scope.items = scope.items.concat(dataSet.items);
            if (scope.items.length > gridBufferCount) {
              // buffer 개수가 max buffer 이상이면 앞에서 부터 한 페이지 개수만큼 비운다.
              scope.items.splice(0, itemByPage);
            }
          } else {
            scope.items = dataSet.items.concat(scope.items);
            if (scope.items.length > gridBufferCount) {
              var removeCount = scope.items.length - gridBufferCount;
              // buffer 개수가 max buffer 이상이면 뒤에서 부터 한 페이지 개수만큼 비운다.
              scope.items.splice(scope.items.length - itemByPage, itemByPage);
            }
          }

          scope.afterSearch(dataSet);
        });
      };

      /**
       * 이전 페이지 검색 - Scroll Up
       * 
       * @return {[type]}
       */
      var prevPage = function () {
        var start = (scope.items && scope.items.length > 0) ? scope.items[0].no : 0;
        if(start > itemByPage) {
          start = start - itemByPage - 1;
          searchByPage(true, start, itemByPage);          
        }

        /*scope.scrollUpFlag = true;
        var start = scope.items[0].no;        
        if(start > itemByPage) {
          ctrl.slice(start - itemByPage - 1, itemByPage);
        }*/
      };

      /**
       * 다음 페이지 검색 - Scroll Down
       * 
       * @return {[type]}
       */
      var nextPage = function () {
        var start = (scope.items && scope.items.length > 0) ? scope.items[scope.items.length - 1].no : 0;
        searchByPage(false, start, itemByPage);

        /*scope.scrollUpFlag = false;
        var start = scope.items[scope.items.length - 1].no;
        pagination.start = start;
        ctrl.slice(pagination.start, itemByPage);*/
      };

      var promise = null;
      var lastRemaining = 9999;
      var container = angular.element(element.parent());
      var tableContainer = container[0];

      container.bind('scroll', function () {
        var scrollTop = tableContainer.scrollTop;

        if(scrollTop < lengthThreshold) {
          //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
          if(!scope.items || scope.items.length == 0 || scope.items[0].no == 1) {
            return;
          }

          if(promise !== null) {
            timeout.cancel(promise);
          }
          
          promise = timeout(function () {

            prevPage();
            //scroll a bit up
            tableContainer.scrollTop += moveScrollPx;
            promise = null;

          }, timeThreshold);

        } else {
          if(!scope.items || scope.items.length == 0 || scope.items[scope.items.length - 1].no >= pagination.totalItemCount) {
            return;
          }

          var remaining = tableContainer.scrollHeight - (tableContainer.clientHeight + scrollTop);

          //if we have reached the threshold and we scroll down
          if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

            //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
            if (promise !== null) {
              timeout.cancel(promise);
            }

            promise = timeout(function () {
              
              nextPage();
              //scroll a bit up
              tableContainer.scrollTop -= moveScrollPx;
              promise = null;

            }, timeThreshold);
          }

          lastRemaining = remaining;
        }
      });
    }
  };
}]);