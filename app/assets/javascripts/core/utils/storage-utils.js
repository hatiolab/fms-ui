angular.module('fmsCore').factory('StorageUtils', function($rootScope, $window, ConstantGeofence) {
	
	return {

		getGeofenceBasicLoc : function() {
			if(this.isEmptyData(ConstantGeofence.LATEST_LOC)) {
				return { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG };
			} else {
				return this.getLocalData(ConstantGeofence.LATEST_LOC);
			}
		},

		setGeofenceBasicLoc : function(lat, lng) {
			this.setLocalData(ConstantGeofence.LATEST_LOC, {latitude: lat, longitude: lng});
		},

		isEmptyData : function(name) {
			var data = this.getLocalData(name);
			return data == null;
		},

		setLocalData : function(name, value) {
			if(angular.isObject(value)) {
				value = JSON.stringify(value);
			}

			$window.localStorage.setItem(name, value);
		},

		getLocalData : function(name) {
			var localData = $window.localStorage.getItem(name);
			if(localData && localData != '') {
				if(localData[0] == "{" || localData[0] == "[") {
					return JSON.parse(localData);
				} else {
					return localData;
				}
			} else {
				return null;
			}
		}

		//------------------------------- E N D ------------------------------------
	};
});
