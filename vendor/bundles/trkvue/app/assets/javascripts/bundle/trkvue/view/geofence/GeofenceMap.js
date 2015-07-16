Ext.define('Trkvue.view.geofence.GeofenceMap', {
	
	extend : 'Ext.panel.Panel',
	
	requires : 'Ext.ux.GMapPanel',
	
	xtype : 'trkvue_geofence_map',
	
	title : T('label.map'),
		
	autoScroll : true,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},	
	
	items : [ {
		xtype: 'panel',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [ {
			id: 'edit',
			xtype: 'checkbox',
			fieldLabel: 'Edit',
			labelWidth: 45,
			itemId: 'edit_chk',
			name: 'edit',
			inputValue: '1'
		} ]
	}, {
		xtype: 'gmappanel',
		flex : 1,
		itemId: 'gmap',
		gmapType: 'map',
		zoomLevel: 14,
		center: {
			lat: DEFAULT_LAT,
			lng: DEFAULT_LNG,
			marker: {
				title: 'Central Park'
			}
		},
		mapOptions : {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	} ],
			
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save']
	} ]
});