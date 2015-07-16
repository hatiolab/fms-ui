Ext.define('Trkvue.view.track.TrackItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.track.TrackForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_track_item',
	
	title : T('menu.Track'),
	
	items : [ 
		{ xtype : 'trkvue_track_form' }
	]
});