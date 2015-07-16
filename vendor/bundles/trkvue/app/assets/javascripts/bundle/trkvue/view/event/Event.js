Ext.define('Trkvue.view.event.Event', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_event',
	
	title : T('menu.Event'),
	
	store : 'Trkvue.store.Event',
	
	columns : [
		//{ header : '#', xtype : 'rownumberer', dataIndex : 'id' },
		{ header : T('label.id'), dataIndex : 'id', width : 180, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.cid'), dataIndex : 'dom' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fid'), dataIndex : 'fid' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fvr'), dataIndex : 'fvr' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.did'), dataIndex : 'did' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.tid'), dataIndex : 'tid', width : 170 },
		{ header : T('label.bid'), dataIndex : 'bid', width : 170 },
		{ header : T('label.gid'), dataIndex : 'gid', width : 110 },
		{ header : T('label.kct'), dataIndex : 'kct', align : 'right', width : 100 },
		{ 
			header : T('label.typ'), 
			dataIndex : 'typ' , 
			width : 60, 
			editor : { 
				xtype : 'codecombo', 
				commonCode : 'EVENT_TYPE'
			}
		},
		{ header : T('label.svr'), dataIndex : 'svr', width : 70, align : 'right' },
		{ header : T('label.vlc'), dataIndex : 'vlc', align : 'right', width : 70 },
		{ header : T('label.lat'), dataIndex : 'lat', align : 'right', width : 120 },
		{ header : T('label.lng'), dataIndex : 'lng', align : 'right', width : 120 },
		{ header : T('label.gx'), dataIndex : 'gx', align : 'right', width : 80 },
		{ header : T('label.gy'), dataIndex : 'gy', align : 'right', width : 80 },
		{ header : T('label.gz'), dataIndex : 'gz', align : 'right', width : 80 },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'vdo', width : 30, align : 'center' },
		{ header : T('label.vdo'), dataIndex : 'vdo', width : 440, editor : { xtype : 'textfield' , maxLength : 255 } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'f_vdo', width : 30, align : 'center' },
		{ header : T('label.f_vdo'), dataIndex : 'f_vdo', width : 400, editor : { xtype : 'textfield' , maxLength : 255 } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'r_vdo', width : 30, align : 'center' },
		{ header : T('label.r_vdo'), dataIndex : 'r_vdo', width : 400, editor : { xtype : 'textfield' , maxLength : 255 } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'ado', width : 30, align : 'center' },
		{ header : T('label.ado'), dataIndex : 'ado', width : 400, editor : { xtype : 'textfield' , maxLength : 255 } },
		{ 
			header : T('label.otm'), 
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
			header : T('label.created_at'), 
			dataIndex : 'ctm',
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
			{ name : 'typ-eq', fieldLabel : T('label.typ') },
			{ name : 'did-eq', fieldLabel : T('label.did') },
			{ name : 'tid-eq', fieldLabel : T('label.tid') },
			{ name : 'bid-eq', fieldLabel : T('label.bid') }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'save', 'delete']
	} ]
});