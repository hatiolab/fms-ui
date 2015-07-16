Ext.define('Trkvue.view.track.Track', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_track',
	
	title : T('menu.Track'),
	
	store : 'Trkvue.store.Track',
	
	columns : [
		//{ header : '#', xtype : 'rownumberer', dataIndex : 'id' },
		{ header : T('label.id'), dataIndex : 'id', width : 170, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fid'), dataIndex : 'fid' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.fvr'), dataIndex : 'fvr' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.tid'), dataIndex : 'tid', width : 170 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.bid'), dataIndex : 'bid', width : 170 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.did'), dataIndex : 'did' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.kct'), dataIndex : 'kct', align : 'right' , editor : { xtype : 'numberfield' } },
		{ header : T('label.vlc'), dataIndex : 'vlc', align : 'right' , editor : { xtype : 'numberfield' } },
		{ header : T('label.a_vlc'), dataIndex : 'a_vlc', align : 'right' , editor : { xtype : 'numberfield' } },
		{ header : T('label.dst'), dataIndex : 'dst', align : 'right', width : 85 , editor : { xtype : 'numberfield' } },
		{ header : T('label.lat'), dataIndex : 'lat', align : 'right', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.lng'), dataIndex : 'lng', align : 'right', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.p_lat'), dataIndex : 'p_lat', align : 'right', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.p_lng'), dataIndex : 'p_lng', align : 'right', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.gx'), dataIndex : 'gx', align : 'right', width : 80 , editor : { xtype : 'numberfield' } },
		{ header : T('label.gy'), dataIndex : 'gy', align : 'right', width : 80 , editor : { xtype : 'numberfield' } },
		{ header : T('label.gz'), dataIndex : 'gz', align : 'right', width : 80 , editor : { xtype : 'numberfield' } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'fimgshow', width : 30, align : 'center' },
		{ header : T('label.f_img'), dataIndex : 'f_img', width : 440 , editor : { xtype : 'textfield' , maxLength : 255 } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'rimgshow', width : 30, align : 'center' },
		{ header : T('label.r_img'), dataIndex : 'r_img', width : 440 , editor : { xtype : 'textfield' , maxLength : 255 } },
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
			dataIndex : 'ttm', 
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
			header : T('label.ctm'), 
			dataIndex : 'ctm', 
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
			{ name : 'tid-eq', fieldLabel : T('label.tid') },
			{ name : 'bid-eq', fieldLabel : T('label.bid') }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'save', 'delete']
	} ]
});