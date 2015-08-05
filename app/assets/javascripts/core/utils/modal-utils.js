angular.module('fmsCore').factory('ModalUtils', function($modal, $log) {
	
	return {

		/**
		 * Confirm popup
		 *
		 * @param  {String} lg : large, sm : small
		 * @param  {String}
		 * @param  {String}
     * @param  {Function}
		 * @return N/A
		 */
		confirm : function(size, title, msg, callback) {
			var modalInstance = $modal.open({
      	animation: true,
      	templateUrl: '/assets/core/views/modal-popup.html',
      	controller: 'ModalPopupCtrl',
      	size: size,
      	resolve: {
          showCancelButton : function() { return true },
        	title: function() { return title },
        	msg : function() { return msg }
      	}
    	});

    	modalInstance.result
        .then(function() {
          // case OK
    		  callback();

        }, function() {
          // case Cancel
        });
		},

    /**
     * Alert popup
     * 
     * @param  {String}
     * @param  {String}
     * @param  {String}
     * @return N/A
     */
    alert : function(size, title, msg) {
      $modal.open({
        animation: true,
        templateUrl: '/assets/core/views/modal-popup.html',
        controller: 'ModalPopupCtrl',
        size: size,
        resolve: {
          showCancelButton : function() { return false },
          title: function() { return title },
          msg : function() { return msg }
        }
      });
    }

		//------------------------------- E N D ------------------------------------
	};
});
