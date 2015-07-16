Ext.define('Trkvue.mixin.OverviewMonitor', {

	/**
	 * new map
	 */
	newMap : function(gmap, position) {
		gmap.setCenter(position);
		return gmap;
	},
	
	/**
	 * 지도에 Fleet 마크 
	 */
	markFleet : function(gmap, bounds, fleet) {
		var point = new google.maps.LatLng(fleet.get('lat'), fleet.get('lng'));
		var me = this;
		
		var marker = new google.maps.Marker({
			position: point,
			map: gmap,
			icon: me.getFleetIcon(fleet)
		});

		this.addMarker(marker);
		
		google.maps.event.addListener(marker, 'click', function() {
			me.showFleetInfo(gmap, marker, fleet.getData());
		});
		
		google.maps.event.addListener(marker, 'dblclick', function() {
			var tripId = fleet.get('trip_id');
			if(tripId && tripId.length > 1) {
				me.moveToTrip(gmap, marker, fleet);
			}
		});

		if(!bounds) {
			bounds = new google.maps.LatLngBounds(point, point);
		} else if(point) {
			bounds.extend(point);
		}
		
		return bounds;
	},
	
	/**
	 * Fleet 상태에 따른 아이콘 리턴 
	 */
	getFleetIcon : function(fleet) {
		var icon = null, status = fleet.get('status');
		
		if(!status || status == '' || status == 'OFF') {
			icon = '/assets/van_off.png';
			
		} else {
			var prefix = '/assets/van_';
			var speed = fleet.get('velocity');
			
			// TODO Setting에 따라 설정 
			if(speed == 0)
				icon = prefix + 'idle.png';
			else if(speed <= 40)
				icon = prefix + 'slow.png';
			else if(speed <= 80)
				icon = prefix + 'normal.png';
			else if(speed < 120)
				icon = prefix + 'fast.png';
			else
				icon = prefix + 'speed.png';
		}

		return icon;
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
	
	showFleetInfo : function(gmap, marker, fleet) {
		if(!this.infowindow)
			this.infowindow = new google.maps.InfoWindow();

		var content = this.tplFleetInfoWindow.apply(fleet);
		this.infowindow.setContent(content);
		this.infowindow.open(gmap, marker);
	},
	
	tplFleetInfoWindow : new Ext.XTemplate(
		'<div>',
		'	<h4><strong>Fleet : {name}</strong></h4>',
		'	<span>Driver : <strong>{driver_id}</strong>,</span>',
		'	<span>Model : <strong>{car_model}</strong>,</span>',
		'	<span>Car No. : <strong>{car_no}</strong>,</span>',
		'</div>'
	)

});