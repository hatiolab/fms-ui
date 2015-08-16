Ext.define('Trkvue.model.Batch', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'tid', type : 'string' },
		{ name : 'sts', type : 'string' },
		{ name : 'dst', type : 'string' },
		{ name : 's_lat', type : 'string' },
		{ name : 's_lng', type : 'string' },
		{ name : 'lat', type : 'string' },
		{ name : 'lng', type : 'string' },
		{ name : 'vlc', type : 'float' },
		{ name : 'a_vlc', type : 'float' },		
		{ name : 'c_off', type : 'integer' },
		{ name : 'c_idl', type : 'integer' },
		{ name : 'c_low', type : 'integer' },
		{ name : 'c_nml', type : 'integer' },
		{ name : 'c_hgh', type : 'integer' },
		{ name : 'c_ovr', type : 'integer' },
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