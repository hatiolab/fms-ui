Ext.define('Trkvue.model.Fleet', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'device_name', type : 'string' },
		{ name : 'device_model', type : 'string' },
		{ name : 'driver_id', type : 'string' },
		{ name : 'car_no', type : 'string' },
		{ name : 'car_model', type : 'string' },
		{ name : 'car_image', type : 'string' },
		{ name : 'fleet_group_id', type : 'string' },
		{ name : 'fleet_group', type : 'auto' },
		{ name : 'purchase_date', type : 'string' },
		{ name : 'reg_date', type : 'string' },
		{ name : 'lat', type : 'float' },
		{ name : 'lng', type : 'float' },
		{ name : 'status', type : 'string' },
		{ name : 'velocity', type : 'float' },
		{ name : 'trip_id', type : 'string' },
		{ name : 'batch_id', type : 'string' },
		{ name : 'track_id', type : 'string' },
		{ name : 'last_trip_time', type : 'date' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'name' },
		{ type : 'presence', field : 'status' }
	],
	
	proxy : {
		type : 'rest',
		url : 'fleets',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'fleet'
		}
	}
});