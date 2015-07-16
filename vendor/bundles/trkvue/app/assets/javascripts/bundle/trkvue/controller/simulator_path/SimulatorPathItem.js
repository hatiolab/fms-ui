/**
 * SimulatorPathDetail controller
 */
Ext.define('Trkvue.controller.simulator_path.SimulatorPathItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.SimulatorPath', 
		'Trkvue.store.SimulatorPath', 
		'Trkvue.view.simulator_path.SimulatorPathItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.SimulatorPath'],
			
	stores : ['Trkvue.store.SimulatorPath'],
	
	views : ['Trkvue.view.simulator_path.SimulatorPathItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_simulator_path_item' : this.EntryPoint(),
			'trkvue_simulator_path_form' : this.FormEventHandler(),
			'trkvue_simulator_path_form #gmap' : {
				mapready : this.onMapReady
			},
		});
	},
	
	/**
	 * callback on after loadItem for each Sub View.
	 * 
	 * @view
	 * @record - data of model
	 */
	onAfterLoadItem : function(view, record, operation) {
		if(record.data.id) {
			var fname = view.down('textfield[name=name]');
			if(fname)
				fname.setReadOnly(true);
		}
	
		view.loadRecord(record);
		var gmap = view.down(' #gmap').gmap;
		this.addPath(gmap, null, null, true);
	},
	
	onMapReady : function(map) {
		var gmap = map.gmap;
		var me = this;
		google.maps.event.addListener(gmap, 'click', function(event) {
			me.addPath(gmap, event.latLng.A, event.latLng.F);
			/*var msg = 'Location : (lat : ' + event.latLng.A + ', lng : ' + event.latLng.F + ')';
			HF.msg.confirm({
				title : 'Add Path?',
				msg : msg, 
				fn : function(btn) {
					if(btn == 'yes') {
						me.addPath(gmap, event.latLng.A, event.latLng.F);
					}
				}, 
				scope : this 
			});*/
		});
	},
	
	addPath : function(gmap, lat, lng) {
		var pathItem = HF.current.view().down(' #paths');
		var pathStr = pathItem.getValue();
		var paths = !pathStr ? [] : Ext.JSON.decode(pathStr);
		
		if(lat && lng) {
			paths.push({lat : lat, lng : lng});
			pathItem.setValue(Ext.JSON.encode(paths));
		}

		this.showPath(gmap, paths, false);
	},
	
	showPath : function(gmap, paths, fit) {
		this.clearAll();
		
		if(!paths || paths.length == 0) {
			return;
		}
		
		var bounds = null, linePaths = [];
		
		for(var i = 0 ; i < paths.length ; i++) {
			var path = paths[i];
			var pos = new google.maps.LatLng(path.lat, path.lng);
			linePaths.push(pos);
			
			if(bounds == null) {
				bounds = new google.maps.LatLngBounds(pos, pos);
			} else {
				bounds.extend(pos);
			}

			var marker = new google.maps.Marker({
				position: pos,
				map: gmap,
				zIndex: i,
				icon: 'assets/tripmarker_off.png',
				info: pos
			});
			
			this.addMarker(marker);
		}
		
		if(fit) {
			gmap.fitBounds(bounds);
		}

		var line = new google.maps.Polyline({
			path: linePaths,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		line.setMap(gmap);
		this.addLine(line);
	},
	
	addLine : function(line) {
		if(line instanceof Array) {
			for(var i = 0 ; i < line.length ; i++) {
				this.addMarker(line[i]);
			}
		} else {
			if(!this.lines) {
				this.lines = [];
			}
			this.lines.push(line);
		}
	},
	
	clearAll : function() {
		this.clearMarkers();
		this.clearLines();
	},
	
	clearMarkers : function() {
		if(!this.markers)
			return;
		
		for(var i = 0 ; i < this.markers.length ; i++) {
			this.markers[i].setMap(null);
		}
		
		this.markers = [];
	},

	clearLines : function() {
		if(!this.lines)
			return;
		
		for(var i = 0 ; i < this.lines.length ; i++) {
			this.lines[i].setMap(null);
		}
		
		this.lines = [];
	},
	
	addMarker : function(marker) {
		if(marker instanceof Array) {
			for(var i = 0 ; i < marker.length ; i++) {
				this.addMarker(marker[i]);
			}
		} else {
			if(!this.markers) {
				this.markers = [];
			}
			this.markers.push(marker);
		}
	},
	
	addLine : function(line) {
		if(line instanceof Array) {
			for(var i = 0 ; i < line.length ; i++) {
				this.addMarker(line[i]);
			}
		} else {
			if(!this.lines) {
				this.lines = [];
			}
			this.lines.push(line);
		}
	}
});