Ext.define('Trkvue.view.batch.BatchItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.batch.BatchForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_batch_item',
	
	title : T('menu.Batch'),
	
	items : [ 
		{ xtype : 'trkvue_batch_form' }
	]
});