Ext.define('Trkvue.view.trip.TripItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.trip.TripForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_trip_item',
	
	title : T('menu.Trip'),
	
	items : [ 
		{ xtype : 'trkvue_trip_form' }
	]
});