Ext.define('Trkvue.view.simulator_path.SimulatorPathForm', {
	
	extend : 'Ext.form.Panel',
	
	requires : 'Ext.ux.GMapPanel',
	
	xtype : 'trkvue_simulator_path_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 32 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ name : 'paths', fieldLabel : T('label.path'), xtype : 'textareafield', itemId : 'paths', rows : 6 },
		{
			xtype: 'gmappanel',
			flex : 1,
			itemId: 'gmap',
			gmapType: 'map',
			zoomLevel: 14,
			center: {
				lat: DEFAULT_LAT,
				lng: DEFAULT_LNG
			},
			mapOptions : {
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		}
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});