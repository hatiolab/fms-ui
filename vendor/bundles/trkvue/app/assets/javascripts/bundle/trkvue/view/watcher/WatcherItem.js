Ext.define('Trkvue.view.watcher.WatcherItem', {
	
	extend : 'Ext.form.Panel',
	
	requires : 'Ext.ux.GMapPanel',
	
	mixins : {
		spotlink : 'Frx.mixin.view.SpotLink'
	},
	
	xtype : 'trkvue_watcher_item',
	
	title : T('menu.Trip'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [ { 
		xtype: 'gmappanel',
		flex : 1,
		itemId: 'gmap',
		gmapType: 'map',
		zoomLevel: 14,
		mapOptions : {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		center: {
			lat: DEFAULT_LAT,
			lng: DEFAULT_LNG
		}
	} ],
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'back']
	} ]
});