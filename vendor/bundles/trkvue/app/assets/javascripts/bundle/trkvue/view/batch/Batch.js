Ext.define('Trkvue.view.batch.Batch', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_batch',
	
	title : T('menu.Batch'),
	
	store : 'Trkvue.store.Batch',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', width : 170, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.tid'), dataIndex : 'tid', width : 170, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ 
			header : T('label.status'), 
			dataIndex : 'sts', 
			width : 65,
			editor : { xtype : 'textfield' },
			renderer : function(val) {
				return val == '1' ? 'RUN' : 'END';
			}
		},
		{ header : T('label.s_lat'), dataIndex : 's_lat', width : 140, editor : { xtype : 'textfield' } },
		{ header : T('label.s_lng'), dataIndex : 's_lng', width : 140, editor : { xtype : 'textfield' } },
		{ header : T('label.lat'), dataIndex : 'lat', align : 'right' , width : 140, editor : { xtype : 'textfield' } },
		{ header : T('label.lng'), dataIndex : 'lng', align : 'right' , width : 140, editor : { xtype : 'textfield' } },
		{ header : T('label.vlc'), dataIndex : 'vlc', align : 'right', width : 70 },
		//{ header : T('label.a_vlc'), dataIndex : 'vlc', align : 'right', width : 70 },
		{ header : T('label.c_off'), dataIndex : 'c_off', align : 'right' , width : 80, editor : { xtype : 'numberfield' } },
		{ header : T('label.c_idl'), dataIndex : 'c_idl', align : 'right' , width : 85, editor : { xtype : 'numberfield' } },
		{ header : T('label.c_low'), dataIndex : 'c_low', align : 'right' , width : 125,  editor : { xtype : 'numberfield' } },
		{ header : T('label.c_nml'), dataIndex : 'c_nml', align : 'right' , width : 140,  editor : { xtype : 'numberfield' } },
		{ header : T('label.c_hgh'), dataIndex : 'c_hgh', align : 'right' , width : 130,  editor : { xtype : 'numberfield' } },
		{ header : T('label.c_ovr'), dataIndex : 'c_ovr', align : 'right' , width : 130,  editor : { xtype : 'numberfield' } },
		{ 
			header : T('label.stm'), 
			dataIndex : 'stm', 
			width : 135 , 
			renderer : function(val) {
				if(val) {
					return Ext.Date.format(new Date(val), T('format.datetime'));
				} else {
					return val;
				}
			}
		},
		{ 
			header : T('label.etm'), 
			dataIndex : 'etm', 
			width : 135,
			renderer : function(val) {
				if(val) {
					return Ext.Date.format(new Date(val), T('format.datetime'));
				} else {
					return val;
				}
			}
		},
		{ 
			header : T('label.utm'), 
			dataIndex : 'utm', 
			width : 135 ,
			renderer : function(val) {
				if(val) {
					return Ext.Date.format(new Date(val), T('format.datetime'));
				} else {
					return val;
				}
			}
		}
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'id-eq', fieldLabel : T('label.id') },
			{ name : 'fid-eq', fieldLabel : T('label.fid') },
			{ name : 'fvr-eq', fieldLabel : T('label.fvr') },
			{ name : 'did-eq', fieldLabel : T('label.did') },
			{ name : 'tid-eq', fieldLabel : T('label.tid') }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'save', 'delete']
	} ]
});