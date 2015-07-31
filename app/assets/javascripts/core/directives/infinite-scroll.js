/**
 * lrInfiniteScrollPlugin
 */
angular.module('smart-table')
    .directive('stPaginationScroll', ['$timeout', function (timeout) {
        return{
            require: 'stTable',
            link: function (scope, element, attr, ctrl) {
                var itemByPage = 20;
                var pagination = ctrl.tableState().pagination;
                var lengthThreshold = 20;
                var timeThreshold = 400;

                var prevPage = function () {
                    //call previous page
                    scope.scrollUpFlag = true;
                    var start = scope.eventItems[0].no;
                    if(start > itemByPage) {
                        ctrl.slice(start - itemByPage, itemByPage);
                    }

                };

                var nextPage = function () {
                    //call next page
                    scope.scrollUpFlag = false;
                    ctrl.slice(pagination.start + itemByPage, itemByPage);
                };

                var promise = null;
                var lastRemaining = 9999;
                var container = angular.element(element.parent());
                var tableContainer = container[0];

                container.bind('scroll', function () {
                    var scrollTop = tableContainer.scrollTop;

                    if(scrollTop < lengthThreshold) {
                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if(scope.eventItems&&scope.eventItems[0].no == 1) {
                            return;
                        }

                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        
                        promise = timeout(function () {
                            prevPage();

                            //scroll a bit up
                            tableContainer.scrollTop += 500;

                            promise = null;
                        }, timeThreshold);


                    } else {
                        if(scope.eventItems&&scope.eventItems[scope.eventItems.length - 1].no >= scope.events.total) {
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
                                tableContainer.scrollTop -= 500;

                                promise = null;
                            }, timeThreshold);
                        }
                        lastRemaining = remaining;
                    }
                });
            }

        };
    }]);