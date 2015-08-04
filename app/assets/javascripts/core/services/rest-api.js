angular.module('fmsCore').factory('RestApi', function($resource) {
	
	return {

		/**
		 * search list for pagination
		 *
		 * @url
		 * @params
		 * @callback
		 */
		search : function(url, params, callback) {
			if(params) {
				params.page = params.page ? params.page : 1;
				params.start = params.start ? params.start : 0;
				params.limit = params.limit ? params.limit : 20;
			}

			var rsc = $resource(url, params);

			rsc.get(function(dataSet, response) {
				dataSet.start = params.start;
				dataSet.limit = params.limit;
				dataSet.page = Math.ceil(dataSet.start / dataSet.limit) + 1;
				dataSet.total_page = (dataSet.total > params.limit) ? Math.ceil(dataSet.total / params.limit) : 1;
				callback(dataSet); 
			});
		},

		/**
		 * find list
		 *
		 * @url
		 * @params
		 * @callback
		 */
		list : function(url, params, callback) {
			var rsc = $resource(url, params);

			rsc.get(function(dataSet, response) {
				callback(dataSet.items);
			});
		},
		
		/**
		 * find only one
		 *
		 * @url
		 * @params
		 * @callback
		 */
		get : function(url, params, callback) {
			var rsc = $resource(url, params);
			rsc.get(function(data, response) {
				callback(data);
			});
		},

		/**
		 * find only one by name
		 *
		 * @url
		 * @params
		 * @callback
		 */
		getByName : function(url, params, callback) {
			var rsc = $resource(url, params);
			rsc.get(function(data, response) {
				callback(data);
			});
		},

		/**
		 * create resource
		 * 
		 * @param  {string}
		 * @param  {object}
		 * @param  {object}
		 * @return N/A
		 */
		create : function(url, params, entity) {
			var rsc = $resource(url, params, {
  			create: {
  				method: 'POST',
					headers: { "Accept" : "*/*", "Content-Type": "application/json" },
  				transformRequest: function(data, headers) {
          	headers = angular.extend({}, headers, {'Accept' : '*/*', 'Content-Type': 'application/json'});
          	return angular.toJson(entity);
        	}
        }
			});

  		return rsc.create();
		},

		/**
		 * update resource
		 * 
		 * @param  {string}
		 * @param  {object}
		 * @param  {object}
		 * @return N/A
		 */
		update : function(url, params, entity) {
			var rsc = $resource(url, params, {
  			update: {
  				method: 'PUT',
					headers: { "Accept" : "*/*", "Content-Type": "application/json" },
  				transformRequest: function(data, headers) {
          	headers = angular.extend({}, headers, {'Accept' : '*/*', 'Content-Type': 'application/json'});
          	return angular.toJson(entity);
        	}
        }
			});

  		return rsc.update();
		},

		/**
		 * update multiple resource
		 * 
		 * @param  {string}
		 * @param  {object}
		 * @param  {object}
		 * @return N/A
		 */
		updateMultiple : function(url, params, entityList) {
			var rsc = $resource(url, params, {
  			updateMultiple: {
  				method: 'POST',
					headers: { "Accept" : "*/*", "Content-Type": "application/json" },
  				transformRequest: function(data, headers) {
          	headers = angular.extend({}, headers, {'Accept' : '*/*', 'Content-Type': 'application/json'});
          	return angular.toJson({ multiple_data : entityList });
        	}
        }
			});

  		return rsc.updateMultiple();
		},

		/**
		 * delete resource
		 * 
		 * @param  {string}
		 * @param  {object}
		 * @return N/A
		 */
		delete : function(url, params) {
			var rsc = $resource(url, {}, {
  			delete: {
  				method: 'DELETE',
					headers: { "Accept" : "*/*", "Content-Type": "application/json" }
        }
			});

  		return rsc.delete();
		}

		//------------------------- E N D ---------------------------------
	};
});
