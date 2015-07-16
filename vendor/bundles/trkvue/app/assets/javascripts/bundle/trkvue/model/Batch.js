Ext.define('Trkvue.model.Batch', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'tid', type : 'string' },
		{ name : 'vlc', type : 'string' },
		{ name : 'a_vlc', type : 'string' },
		{ name : 'sts', type : 'string' },
		{ name : 'dst', type : 'string' },
		{ name : 's_lat', type : 'string' },
		{ name : 's_lng', type : 'string' },
		{ name : 'lat', type : 'string' },
		{ name : 'lng', type : 'string' },
		{ name : 'c_off', type : 'string' },
		{ name : 'c_idl', type : 'string' },
		{ name : 'c_low', type : 'string' },
		{ name : 'c_nml', type : 'string' },
		{ name : 'c_hgh', type : 'string' },
		{ name : 'c_ovr', type : 'string' },
		{ name : 'stm', type : 'integer' },
		{ name : 'etm', type : 'integer' },
		{ name : 'utm', type : 'integer' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'tid' },
		{ type : 'presence', field : 's_lat' },
		{ type : 'presence', field : 's_lng' },
		{ type : 'presence', field : 'lat' },
		{ type : 'presence', field : 'lng' },
		{ type : 'presence', field : 'stm' },
		{ type : 'presence', field : 'etm' },
		{ type : 'presence', field : 'utm' }
	],
	
	proxy : {
		type : 'rest',
		url : 'batches',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'batch'
		}
	}
});