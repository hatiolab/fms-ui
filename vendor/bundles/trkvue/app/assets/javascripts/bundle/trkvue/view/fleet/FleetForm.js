Ext.define('Trkvue.view.fleet.FleetForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_fleet_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), allowBlank : false },
		{ name : 'domain_id', fieldLabel : T('label.domain_id'), allowBlank : false },
		{ name : 'device_name', fieldLabel : T('label.device_name') },
		{ name : 'device_model', fieldLabel : T('label.device_model') },
		{ name : 'driver_id', fieldLabel : T('label.driver_id'), allowBlank : false },
		{ name : 'car_no', fieldLabel : T('label.car_no') },
		{ name : 'car_model', fieldLabel : T('label.car_model') },
		{ name : 'car_image', fieldLabel : T('label.car_image') },
		{
			name: 'fleet_group',
			fieldLabel: T('label.group_id'),
			xtype : 'entityfield', 
			allowBlank: true,
			storeClass : 'Trkvue.store.FleetGroup',
		},
		{ name : 'purchase_date', fieldLabel : T('label.purchase_date') },
		{ name : 'reg_date', fieldLabel : T('label.reg_date') },
		{ name : 'lat', fieldLabel : T('label.lat'), xtype : 'numberfield' },
		{ name : 'lng', fieldLabel : T('label.lng'), xtype : 'numberfield' },
		{ name : 'status', fieldLabel : T('label.status'), allowBlank : false },
		{ name : 'velocity', fieldLabel : T('label.velocity'), xtype : 'numberfield', minValue : 0, maxValue : 200 },
		{ name : 'trip_id', fieldLabel : T('label.trip_id') },
		{ name : 'batch_id', fieldLabel : T('label.batch_id') },
		{ name : 'track_id', fieldLabel : T('label.track_id') },
		{ name : 'last_trip_time', fieldLabel : T('label.last_trip_time') },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});