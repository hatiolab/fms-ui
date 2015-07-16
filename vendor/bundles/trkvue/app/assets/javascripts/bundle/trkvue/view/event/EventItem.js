Ext.define('Trkvue.view.event.EventItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.event.EventForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_event_item',
	
	title : T('menu.Event'),
	
	items : [ 
		{ xtype : 'trkvue_event_form' }
	]
});