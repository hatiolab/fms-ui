Ext.define('Trkvue.model.Event', {

	extend : 'Ext.data.Model',

	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'dom', type : 'string' },
		{ name : 'fid', type : 'string' },
		{ name : 'fvr', type : 'string' },
		{ name : 'did', type : 'string' },
		{ name : 'tid', type : 'string' },
		{ name : 'bid', type : 'string' },
		{ name : 'gid', type : 'string' },
		{ name : 'kct', type : 'integer' },
		{ name : 'typ', type : 'string' },
		{ name : 'vlc', type : 'float' },
		{ name : 'svr', type : 'string' },
		{ name : 'lat', type : 'float' },
		{ name : 'lng', type : 'float' },
		{ name : 'gx', type : 'float' },
		{ name : 'gy', type : 'float' },
		{ name : 'gz', type : 'float' },
		{ name : 'vdo', type : 'string' },
		{ name : 'f_vdo', type : 'string' },
		{ name : 'r_vdo', type : 'string' },
		{ name : 'ado', type : 'string' },
		{ name : 'etm', type : 'integer' },
		{ name : 'ctm', type : 'integer' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'fid' },
		{ type : 'length', field : 'fid', max : 32 },
		{ type : 'presence', field : 'fvr' },
		{ type : 'length', field : 'fvr', max : 32 },
		{ type : 'presence', field : 'did' },
		{ type : 'length', field : 'did', max : 32 },
		{ type : 'presence', field : 'tid' },
		{ type : 'length', field : 'tid', max : 32 },
		{ type : 'presence', field : 'lat' },
		{ type : 'presence', field : 'lng' },
		{ type : 'presence', field : 'gx' },
		{ type : 'presence', field : 'gy' },
		{ type : 'presence', field : 'gz' },
		{ type : 'length', field : 'vdo', max : 255 },
		{ type : 'length', field : 'f_vdo', max : 255 },
		{ type : 'length', field : 'r_vdo', max : 255 },
		{ type : 'length', field : 'ado', max : 255 }
	],
	
	proxy : {
		type : 'rest',
		url : 'events',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'event'
		}
	}
});