/**
 * FleetGroupDetail controller
 */
Ext.define('Trkvue.controller.fleet_group.FleetGroupItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.FleetGroup', 
		'Trkvue.store.FleetGroup', 
		'Trkvue.store.GeofenceGroup', 
		'Trkvue.view.fleet_group.FleetGroupItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle',
		'Frx.mixin.lifecycle.ListLifeCycle'
	],
	
	models : ['Trkvue.model.FleetGroup'],
			
	stores : ['Trkvue.store.FleetGroup'],
	
	views : ['Trkvue.view.fleet_group.FleetGroupItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_fleet_group_item' : this.EntryPoint(),
			'trkvue_fleet_group_form' : this.FormEventHandler(),
			'trkvue_fleet_group_geofence_list' : this.ListEventHandler({
				after_load_item : this.onGeofenceGroupListLoad
			})
		});
	},
	
	onGeofenceGroupListLoad : function(view, record, operation) {
		view.store.proxy.extraParams = {
			'_q[fleet_group_id-eq]' : record.get('id')
		};
		view.store.load();
	},

	onAfterUpdateList : function(grid, updateType, response) {
		grid.store.reload();
		var successMsg = (updateType == 'd') ? T('text.Success to Delete') : T('text.Success to Update');
		HF.msg.notice(successMsg);
	},
	
	/**
	 * override - multiple update url을 리턴 
	 */
	getUpdateListUrl : function(grid) {
		return 'geofence_groups/update_multiple.json';
	},
	
	/**
	 * override
	 */
	newRecord : function(grid) {
		var model = Ext.create('Trkvue.model.GeofenceGroup');
		model.set('fleet_group_id', HF.current.view().getParams().id);
		return model;
	}
});