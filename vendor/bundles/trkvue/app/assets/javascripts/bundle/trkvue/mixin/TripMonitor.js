Ext.define('Trkvue.mixin.TripMonitor', {

	showTrip : function(gmap, fleet, trip, batchList, trackList) {
		
		this.clearAll();
		
		var elpased = (trip.get('etm') - trip.get('stm')) / 1000;
		trip.set('elapsed', elpased);
		var distance = 0, path = [], bounds = null, zindex = 0;

		// Batch Marker
		for(var i = 0 ; i < batchList.length ; i++) {
			var batch = batchList[i];
			
			for(var j = 0 ; j < trackList.length ; j++) {
				var track = trackList[j];
			
				if(track.get('bid') == batch.get('id')) {
					distance += track.get('dst');
			
					var pos = new google.maps.LatLng(track.get('lat'), track.get('lng'))
					path.push(pos);
			
					if(bounds == null) {
						bounds = new google.maps.LatLngBounds(pos, pos);
					} else {
						bounds.extend(pos);
					}

					var marker = new google.maps.Marker({
						position: pos,
						map: gmap,
						zIndex: zindex++,
						icon: this.getTrackIcon(track),
						info: track.data
					});
					
					this.addMarker(marker);

					/*google.maps.event.addListener(marker, 'click', function(e) {
						var track = this.info;
						var content = App.view.track.TrackController.tplTrackInfoWindow.apply(track);
						self.setInformationWindow(gmap, content, this);
					});*/
				}
			}
			
			// Batch Start & End Marker
			var batchStartMarker = new google.maps.Marker({
				position: new google.maps.LatLng(batch.get('s_lat'), batch.get('s_lng')),
				map: gmap,
				zIndex: zindex++,
				icon: this.getBatchStartIcon(trip),
				info: batch.data
			});
			
			this.addMarker(batchStartMarker);
		
			if(batch.get('sts') == '2') {
				var batchEndMarker = new google.maps.Marker({
					position: new google.maps.LatLng(batch.get('lat'), batch.get('lng')),
					map: gmap,
					zIndex: zindex++,
					icon: this.getBatchEndIcon(trip),
					info: batch.data
				});
			
				this.addMarker(batchEndMarker);
			}
		}
		
		// Trip Start & End Marker
		var tripStartMarker = new google.maps.Marker({
			position: new google.maps.LatLng(trip.get('s_lat'), trip.get('s_lng')),
			map: gmap,
			zIndex: zindex++,
			icon: this.getTripStartIcon(trip),
			info: trip.data
		});
			
		this.addMarker(tripStartMarker);
		
		if(trip.get('sts') == '2') {
			var tripEndMarker = new google.maps.Marker({
				position: new google.maps.LatLng(trip.get('lat'), trip.get('lng')),
				map: gmap,
				zIndex: zindex++,
				icon: this.getTripEndIcon(trip),
				info: trip.data
			});
			
			this.addMarker(tripEndMarker);
		}
		
		trip.set('distance', distance);
		gmap.fitBounds(bounds);

		var line = new google.maps.Polyline({
			path: path,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		line.setMap(gmap);
		this.addLine(line);
	},
	
	getTrackIcon : function(track) {
		var icon = null, status = track.get('status');
		var prefix = 'tripmarker_';
		if(track.get('f_img') || track.get('r_img'))
			prefix += 'i_';

		var speed = track.get('vlc');
		
		if(speed == 0)
			icon = prefix + 'idle';
		else if(speed <= 40)
			icon = prefix + 'slow';
		else if(speed <= 80)
			icon = prefix + 'normal';
		else if(speed < 120)
			icon = prefix + 'fast';
		else
			icon = prefix + 'speed';
		
		return '/assets/' + icon + '.png';
	},
	
	getTripStartIcon : function(trip) {
		return '/assets/tripstart.png';
	},
	
	getTripEndIcon : function(trip) {
		return '/assets/tripend.png';
	},

	getBatchStartIcon : function(trip) {
		return '/assets/batchstart.png';
	},
	
	getBatchEndIcon : function(trip) {
		return '/assets/batchend.png';
	}
});