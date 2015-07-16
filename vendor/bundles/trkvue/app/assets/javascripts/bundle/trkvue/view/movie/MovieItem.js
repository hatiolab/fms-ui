Ext.define('Trkvue.view.movie.MovieItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.movie.MovieForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_movie_item',
	
	title : T('menu.Movie'),
	
	items : [ 
		{ xtype : 'trkvue_movie_form' }
	]
});