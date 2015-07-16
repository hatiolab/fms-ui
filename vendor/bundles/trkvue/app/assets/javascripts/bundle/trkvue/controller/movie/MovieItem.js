/**
 * MovieDetail controller
 */
Ext.define('Trkvue.controller.movie.MovieItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Movie', 
		'Trkvue.store.Movie', 
		'Trkvue.view.movie.MovieItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Movie'],
			
	stores : ['Trkvue.store.Movie'],
	
	views : ['Trkvue.view.movie.MovieItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_movie_item' : this.EntryPoint(),
			'trkvue_movie_form' : this.FormEventHandler()
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	// Customized code here ...
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/

	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	****************************************************************/

});