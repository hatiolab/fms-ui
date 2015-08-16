Ext.define('Trkvue.model.Trip', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'dom', type : 'string' },
		{ name : 'bid', type : 'string' },
		{ name : 'fid', type : 'string' },
		{ name : 'fvr', type : 'string' },
		{ name : 'did', type : 'string' },
		{ name : 'sts', type : 'string' },
		{ name : 's_lat', type : 'float' },
		{ name : 's_lng', type : 'float' },
		{ name : 'lat', type : 'float' },
		{ name : 'lng', type : 'float' },
		{ name : 'vlc', type : 'float' },
		{ name : 'a_vlc', type : 'float' },		
		{ name : 'stm', type : 'integer' },
		{ name : 'utm', type : 'integer' },
		{ name : 'etm', type : 'integer' },
		{ name : 'c_off', type : 'integer' },
		{ name : 'c_idl', type : 'integer' },
		{ name : 'c_low', type : 'integer' },
		{ name : 'c_nml', type : 'integer' },
		{ name : 'c_hgh', type : 'integer' },
		{ name : 'c_ovr', type : 'integer' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'fid' },
		{ type : 'length', field : 'fid', max : 32 },
		{ type : 'presence', field : 'fvr' },
		{ type : 'length', field : 'fvr', max : 32 },
		{ type : 'presence', field : 'did' },
		{ type : 'length', field : 'did', max : 32 },
		{ type : 'presence', field : 's_lat' },
		{ type : 'presence', field : 's_lng' },
		{ type : 'presence', field : 'stm' },
		{ type : 'presence', field : 'utm' },
		{ type : 'presence', field : 'sts' }
	],
	
	proxy : {
		type : 'rest',
		url : 'trips',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'trip'
		}
	}
});