Ext.define('Trkvue.view.trip.Trip', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_trip',
	
	title : T('menu.Trip'),
	
	store : 'Trkvue.store.Trip',
	
	columns : [
		// { header : '#', xtype : 'rownumberer', dataIndex : 'id' },
		{ header : T('label.id'), dataIndex : 'id', width : 170, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.bid'), dataIndex : 'bid', width : 170, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fid'), dataIndex : 'fid' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fvr'), dataIndex : 'fvr' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.did'), dataIndex : 'did' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.s_lat'), dataIndex : 's_lat', align : 'right' , width : 120, editor : { xtype : 'textfield' } },
		{ header : T('label.s_lng'), dataIndex : 's_lng', align : 'right' , width : 120, editor : { xtype : 'textfield' } },
		{ header : T('label.lat'), dataIndex : 'lat', align : 'right' , width : 120, editor : { xtype : 'textfield' } },
		{ header : T('label.lng'), dataIndex : 'lng', align : 'right' , width : 120, editor : { xtype : 'textfield' } },
		{ header : T('label.c_off'), dataIndex : 'c_off', align : 'right' , width : 80, editor : { xtype : 'numberfield' } },
		{ header : T('label.c_idl'), dataIndex : 'c_idl', align : 'right' , width : 90, editor : { xtype : 'numberfield' } },
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
			header : T('label.utm'), 
			dataIndex : 'utm', 
			width : 135,
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
			{ name : 'did-eq', fieldLabel : T('label.did') }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'save', 'delete']
	} ]
});