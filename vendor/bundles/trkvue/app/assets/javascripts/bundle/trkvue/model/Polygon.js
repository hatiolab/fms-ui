Ext.define('Trkvue.model.Polygon', {

	extend : 'Ext.data.Model',

	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'geofence_id', type : 'string' },
		{ name : 'geofence', type : 'auto' },
		{ name : 'lat', type : 'float' },
		{ name : 'lng', type : 'float' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'geofence_id' },
		{ type : 'presence', field : 'lat' },
		{ type : 'presence', field : 'lng' }
	],
	
	proxy : {
		type : 'rest',
		url : 'polygons',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'polygon'
		}
	}
});