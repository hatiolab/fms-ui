Ext.define('Trkvue.view.watcher.Watcher', {
	
	extend : 'Ext.form.Panel',
	
	requires : 'Ext.ux.GMapPanel',
	
	mixins : {
		spotlink : 'Frx.mixin.view.SpotLink'
	},
	
	xtype : 'trkvue_watcher',
	
	title : T('menu.Watcher'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [ { 
		xtype: 'gmappanel',
		flex : 1,
		itemId: 'gmap',
		gmapType: 'map',
		zoomLevel: 9,
		mapOptions : {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		center: {
			lat: DEFAULT_LAT,
			lng: DEFAULT_LNG
		}
	} ],
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [ { 
			name : 'fleet_group',
			fieldLabel : T('label.group_id'),
			xtype : 'entitysearchcombo',
			storeClass : 'Trkvue.store.FleetGroup',
			valueField : 'id'
		}, { 
			name : 'fleet', 
			fieldLabel : T('label.fid'),
			xtype : 'entitysearchcombo',
			storeClass : 'Trkvue.store.Fleet',
			valueField : 'id'
		}, { 
			id : 'refresh',
			name : 'refresh', 
			fieldLabel : T('label.refresh'),
			xtype : 'checkbox'
		}, { 
			id : 'interval',
			name : 'interval', 
			fieldLabel : T('label.interval') + ' (sec.)',
			xtype : 'numberfield',
			value : 5,
			minValue : 1,
			maxValue : 1000
		} ]
	}, {
		xtype : 'controlbar',
		items : ['->']
	} ]
});