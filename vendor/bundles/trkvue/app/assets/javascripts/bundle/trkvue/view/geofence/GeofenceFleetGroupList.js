Ext.define('Trkvue.view.geofence.GeofenceFleetGroupList', {
	
	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.ux.CheckColumn',
		'Trkvue.store.FleetGroup',
		'Trkvue.store.GeofenceGroup'
	],
	
	xtype : 'trkvue_geofence_fleet_group_list',
	
	title : T('menu.FleetGroup'),
		
	store : Ext.create('Trkvue.store.GeofenceGroup'),

	columns : [ { 
		dataIndex : 'id',
		text : T('label.id'),
		hidden : true
	}, {
		text : T('menu.FleetGroup'), 
		dataIndex : 'fleet_group', 
		xtype : 'entitycolumn', 
		width : 150,
		editor : { 
			xtype : 'entitycolumneditor', 
			storeClass : 'Trkvue.store.FleetGroup' 
		}
	}, {
		dataIndex : 'fleet_group',
		text : T('label.description'),
		flex : 1,
		renderer : function(val) {
			return val && val.description ? val.description : '';
		}
	}, { 
		header : T('label.type'), 
		dataIndex : 'alarm_type', 
		editor : { 
			xtype : 'codecombo', 
			commonCode : 'GEOFENCE_ALARM'
		}
	}, { 
		header : T('label.updater'), 
		dataIndex : 'updater', 
		xtype : 'entitycolumn' 
	}, { 
		header : T('label.updated_at'), 
		dataIndex : 'updated_at', 
		xtype : 'datecolumn', 
		format : T('format.datetime'), 
		width : 135
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ],
	
	initComponent : function() {
		/**
		*	피상속 클래스의 플러그인 객체와 셀모델 객체는 공유되어서는 안된다.
		*/
		this.plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			autoCancel : true
		}) ];
		
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { pruneRemoved : false });
		
		this.callParent();
	},
});
