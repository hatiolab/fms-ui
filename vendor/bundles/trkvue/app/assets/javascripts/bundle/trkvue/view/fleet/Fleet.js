Ext.define('Trkvue.view.fleet.Fleet', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_fleet',
	
	title : T('menu.Fleet'),
	
	store : 'Trkvue.store.Fleet',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.device_name'), dataIndex : 'device_name' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.device_model'), dataIndex : 'device_model' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.driver_id'), dataIndex : 'driver_id' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.car_no'), dataIndex : 'car_no' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.car_model'), dataIndex : 'car_model' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.group_id'), dataIndex : 'fleet_group', xtype : 'entitycolumn', editor : { xtype : 'entitycolumneditor', storeClass : 'Trkvue.store.FleetGroup' } },
		{ header : T('label.purchase_date'), dataIndex : 'purchase_date', width : 110 , editor : { xtype : 'textfield' , maxLength : 10 } },
		{ header : T('label.reg_date'), dataIndex : 'reg_date' , editor : { xtype : 'textfield' , maxLength : 10 } },
		{ header : T('label.lat'), dataIndex : 'lat', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.lng'), dataIndex : 'lng', width : 120 , editor : { xtype : 'textfield' } },
		{ header : T('label.status'), dataIndex : 'status', width : 70 , editor : { xtype : 'textfield' , maxLength : 10 } },
		{ header : T('label.velocity'), dataIndex : 'velocity', width : 70, align : 'right' , editor : { xtype : 'numberfield', min : 0, max : 200 } },
		{ header : T('label.trip_id'), dataIndex : 'trip_id', width : 180 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.batch_id'), dataIndex : 'batch_id', width : 180 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.track_id'), dataIndex : 'track_id', width : 180 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.last_trip_time'), dataIndex : 'last_trip_time', xtype : 'datecolumn', format : T('format.datetime'), width : 135 }
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'name-like', fieldLabel : T('label.code') },
			{ name : 'status-like', fieldLabel : T('label.status') },
			{ name : 'car_no-like', fieldLabel : T('label.car_no') },
			{ name : 'fleet_group.name-eq', fieldLabel : T('label.group_id'), xtype : 'entitysearchcombo', storeClass : 'Trkvue.store.FleetGroup', valueField : 'name' }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', /*'import', 'export',*/'add', 'save', 'delete']
	} ]
});