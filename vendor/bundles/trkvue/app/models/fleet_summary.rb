class FleetSummary < ActiveRecord::Base

	include Multitenant

	stampable

	validates_presence_of :fleet_id,:sum_day,:sum_year,:sum_month,:sum_week, :strict => true

	validates :sum_day, length: { maximum: 10 }, :strict => true

	validates :sum_year, length: { maximum: 4 }, :strict => true

	validates :sum_month, length: { maximum: 2 }, :strict => true

	validates :sum_week, length: { maximum: 3 }, :strict => true

	validates_uniqueness_of :sum_day, :strict => true, :scope => [:domain_id,:fleet_id]

	belongs_to :fleet

	#
	# Daily Summary
	#
	def self.daily_summary(dateStr)
		date = Date.parse(dateStr)
		year, month, week = date.year, date.month, date.strftime("%U").to_i
		startTime, endTime = date.to_time.to_i * 1000, (date + 1).to_time.to_i * 1000

		fleets = Fleet.all
		return unless fleets
		
		trips = FleetSummary.find_trips(startTime, endTime)

		fleets.each do |fleet|
			FleetSummary.summary_by_fleet(startTime, endTime, date, year, month, week, fleet, trips)
		end
	end

	def self.find_trips(startTime, endTime)
		return Trip.any_of({'stm' => { '$gte' => startTime , '$lt' => endTime }}, {'etm' => { '$gte' => startTime , '$lt' => endTime }})
	end

	#
	# Daily Summary By Fleet
	#
	def self.summary_by_fleet(startTime, endTime, date, year, month, week, fleet, trips)
		track_conds = { 'stm' => { '$gte' => startTime , '$lt' => endTime }, 'fid' => fleet.name }		
		event_conds = { 'etm' => track_conds['stm'], 'fid' => track_conds['fid'] }

		fleetSum = FleetSummary.where("sum_day = ? and fleet_id = ?", date, fleet.id).first
		unless fleetSum
			fleetSum = FleetSummary.new 
			fleetSum.fleet_id = fleet.id
			fleetSum.sum_day = date
			fleetSum.sum_year = year
			fleetSum.sum_month = month
			fleetSum.sum_week = week
		end

		fleetSum.drive_time = FleetSummary.get_trip_time(trips, fleet, startTime, endTime)
		debug_print fleetSum.drive_time
		fleetSum.velocity = FleetSummary.get_track_avg(track_conds, 'vlc')
		fleetSum.drive_dist = FleetSummary.get_track_sum(track_conds, 'dst')
		fleetSum.impact = FleetSummary.get_event_count(event_conds, 'G')
		fleetSum.geofence = FleetSummary.get_event_count(event_conds, ['I', 'O'])
		fleetSum.emergency = FleetSummary.get_event_count(event_conds, 'B')
		fleetSum.overspeed = FleetSummary.get_event_count(event_conds, 'V')
		fleetSum.speed_off = FleetSummary.get_speed_count(track_conds, 'c_off', 'speed_off')
		fleetSum.speed_idle = FleetSummary.get_speed_count(track_conds, 'c_idl', 'speed_idle')
		fleetSum.speed_slow = FleetSummary.get_speed_count(track_conds, 'c_low', 'speed_slow')
		fleetSum.speed_normal = FleetSummary.get_speed_count(track_conds, 'c_nml', 'speed_normal')
		fleetSum.speed_high = FleetSummary.get_speed_count(track_conds, 'c_hgh', 'speed_high')
		fleetSum.speed_over = FleetSummary.get_speed_count(track_conds, 'c_ovr', 'speed_over')
		fleetSum.save!
	end

	def self.get_trip_time(trips, fleet, startTime, endTime)
		tripTime, foundTrips = 0, trips.select { |trip| trip.fid == fleet.name }
		return 0 if(!foundTrips || foundTrips.empty?)
		
		foundTrips.each do |trip|
			stm, etm = trip.stm.to_i, trip.etm.to_i
			# 1. 트립 시작 시간과 트립 완료 시간이 startTime, endTime 사이인 경우 : etm - stm
			if(startTime <= stm && endTime >= etm)
				tripTime += (etm - stm)
			# 2. 트립 시작 시간과 트립 완료 시간이 startTime, endTime을 포함하는 경우 : endTime - startTime
			elsif (starTime >= stm && endTime <= etm) 
				tripTime += (endTime - startTime)
			# 3. 트립 시작 시간이 startTime보다 이전이고 트립 완료 시간이 endTime 이전일 경우 : etm - startTime
			elsif (starTime >= stm && endTime >= etm) 
				tripTime += (etm - startTime)
			# 4. 트립 시작 시간이 startTime 이 후이고 완료 시간이 endTime보다 이 후인 경우 : endTime - stm
			elsif (starTime <= stm && endTime <= etm) 
				tripTime += (endTime - stm)
			end
		end

		tripTime = tripTime / 1000 / 60 if(tripTime > 0)
		return tripTime
	end

	def self.get_track_avg(conds, field)
		match = { "$match" => conds }
		group = { "$group" => { "_id" => nil, "avg" => { "$avg" => "$#{field}" }} }
		result = Track.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["avg"] : 0
	end

	def self.get_track_sum(conds, field)
		match = { "$match" => conds }
		group = { "$group" => { "_id" => nil, "sum" => { "$sum" => "$#{field}" }} }
		result = Track.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["sum"] : 0
	end

	def self.get_event_count(conds, type)
		conds['typ'] = (type.class.name == 'Array') ? { '$in' => type } : type
		match = { "$match" => conds }
		group = { "$group" => { "_id" => "id", "count" => { "$sum" => 1 }} }
		result = Event.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["count"] : 0
	end

	def self.get_speed_count(conds, field, level)
		FleetSummary.set_speed_cond(conds, level)
		match = { "$match" => conds }
		group = { "$group" => { "_id" => "id", "count" => { "$sum" => 1 }} }
		result = Track.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["count"] : 0
	end

	def self.set_speed_cond(conds, level)
		if('speed_off' == level)
			conds['vlc'] = -1
		elsif('speed_idle' == level)
			conds['vlc'] = 0
		elsif('speed_slow' == level)
			conds['vlc'] = { "$gt" => 0, "$lt" => Setting.getIntValue(level) }
		elsif('speed_normal' == level)
			conds['vlc'] = { "$gte" => Setting.getIntValue('speed_slow'), "$lt" => Setting.getIntValue(level) }
		elsif('speed_high' == level)
			conds['vlc'] = { "$gte" => Setting.getIntValue('speed_normal'), "$lt" => Setting.getIntValue(level) }
		else
			conds['vlc'] = { "$gte" => Setting.getIntValue('speed_high') }
		end
	end

end
