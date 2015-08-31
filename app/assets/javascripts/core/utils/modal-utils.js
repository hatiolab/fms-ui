angular.module('fmsCore').factory('ModalUtils', function($modal, $log) {
	
	return {

		/**
		 * Confirm popup
		 *
		 * @param  {String} lg : large, sm : small
		 * @param  {String}
		 * @param  {String}
     * @param  {Function}
     * @param  {Function}
		 * @return N/A
		 */
		confirm : function(size, title, msg, callback, cancelCallback) {
			var modalInstance = $modal.open({
      	animation : true,
      	templateUrl : '/assets/core/views/modal-popup.html',
      	controller : 'ModalPopupCtrl',
      	size : size,
      	resolve : {
          showCancelButton : function() { return true },
        	title : function() { return title },
        	msg : function() { return msg },
          localeRes : function() { return null; }
      	}
    	});

    	modalInstance.result.then(
        function() {
          if(callback)
    		    callback();
        },
        function() {
          if(cancelCallback)
            cancelCallback();
        });
		},

    /**
     * Alert popup
     * 
     * @param  {String} lg : large, sm : small
     * @param  {String}
     * @param  {String}
     * @param  {Function}
     * @return N/A
     */
    alert : function(size, title, msg, callback) {
      var modalInst = $modal.open({
        animation : true,
        templateUrl : '/assets/core/views/modal-popup.html',
        controller : 'ModalPopupCtrl',
        size : size,
        resolve : {
          showCancelButton : function() { return false },
          title : function() { return title },
          msg : function() { return msg },
          localeRes : function() { return null; }
        }
      });

      modalInst.result.then(function() {
        if(callback)
          callback();
      });

      return modalInst;
    },

    /**
     * Multilanguege popup
     *
     * @param  {String} lg : large, sm : small
     * @param  {String}
     * @param  {String}
     * @param  {Function}
     * @return N/A
     */
    
    change : function(size, title, msg, localeRes, callback) {
      var modalInstance = $modal.open({
        animation : true,
        templateUrl : '/assets/core/views/modal-translate.html',
        controller : 'ModalPopupCtrl',
        size : size,
        resolve : {
          showCancelButton : function() { return true },
          title : function() { return title },
          msg : function() { return msg },
          localeRes : function() { return localeRes }
        }
      });

      modalInstance.result.then(function() {
        if(callback)
          callback(localeRes);
      });
    }
		//------------------------------- E N D ------------------------------------
	};
});
