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
        	msg : function() { return msg },
          local_res:function() {return ''}
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
          msg : function() { return msg },
          local_res:function() {return ''}
        }
      });
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
    
    change : function(size, title, msg, local_res, callback) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/assets/core/views/modal-translate.html',
        controller: 'ModalPopupCtrl',
        size: size,
        resolve: {
          showCancelButton : function() { return true },
          title: function() { return title },
          msg : function() { return msg },
          local_res : function(){ return local_res}
        }
      });

      modalInstance.result
        .then(function() {
          // case OK
          callback(local_res);

        }, function() {
          // case Cancel
          
        });
    }
		//------------------------------- E N D ------------------------------------
	};
});
