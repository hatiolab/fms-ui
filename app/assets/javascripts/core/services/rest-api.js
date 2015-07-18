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
				params.limit = params.limit ? params.limit : 30;
			}

			var rsc = $resource(url, params);

			rsc.get(function(dataSet, response) {
				dataSet.start = params.start;
				dataSet.limit = params.limit;
				dataSet.page = params.page;
				dataSet.total_page = (params.total > params.limit) ? Math.ceil(params.total / params.limit) : 1;
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
		}

	};
});
