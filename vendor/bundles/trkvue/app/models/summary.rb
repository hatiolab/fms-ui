class Summary 

	include ActiveModel::Model

	############################################################################################
	# 																	Hourly Summary
	############################################################################################
	#
	# Hourly summary
	#
	def self.hourly_summary
		debug_print "Hourly summary start..."

		Domain.all.each do |domain|
			if(domain.timezone)
				now = ActiveSupport::TimeZone[domain.timezone].now
				endTime = Summary.hourly_summary_by_domain(domain, now)
				domain.last_summary_time = endTime / 1000
				domain.save
			else
				debug_print "Domain [#{domain.name}] has no timezone, so skip summary!"
			end
		end
		
		debug_print "Hourly summary completed"		
	end

	#
	# Hourly Summary By Domain
	#
	def self.hourly_summary_by_domain(domain, now)
		# 1. 날짜, 년, 월, 일, 주, 시작 시간, 끝 시간 값을 구한다.
		date_info = Summary.get_hourly_summary_time_info(domain, now)
		sum_date, year, month, week, startTime, endTime = date_info[0], date_info[1], date_info[2], date_info[3], date_info[4], date_info[5]
		# 2. Current Domain 설정 
		Domain.current_domain = domain
		debug_print "Domain (#{domain.name}) houly summary start..."
		# 4. Fleet 별 Daily Summary
		closingDailySummary = (now.hour == 0);	# 0시이면 이전 날짜에 대한 서머리를 종료한다.
		Summary.do_fleet_summary_by_hourly(domain, sum_date, year, month, week, startTime, endTime, closingDailySummary)
		# 5. Fleet Group 별 Daily Summary
		Summary.do_fleet_group_summary(domain, sum_date, year, month, week)
		debug_print "Domain (#{domain.name}) hourly summary completed"
		return endTime
	end

	#
	# 타임존에 따른 현재 날짜와 시각을 구한다
	#
	def self.get_hourly_summary_time_info(domain, now)
		# 1. 타임존에 따른 현재 시각을 구한다.
		sum_date, date_format = ((now.hour == 0) ? sum_date - 1 : now.to_date), '%Y-%m-%d'
		# 2. 날짜, 년, 월, 일, 주 값을 구한다.
		year, month, week = sum_date.year, sum_date.month, sum_date.strftime("%U").to_i

		sumDateStr = sum_date.strftime(date_format)
		startTime = ActiveSupport::TimeZone[Domain.current_domain.timezone].parse(sumDateStr).to_time.to_i * 1000
		#startTime = (domain.last_summary_time * 1000) + 1
		endTime = now.to_time.to_i * 1000

		if(now.hour == 0)
			# 시각이 0시 이면 서머리 날짜는 전날이고 서머리 완료시간이 정각 자정이어야 한다.
			to_date = sum_date + 1
			sumDateToStr = to_date.strftime(date_format)
			endTime = ActiveSupport::TimeZone[Domain.current_domain.timezone].parse(sumDateToStr).to_time.to_i * 1000
		end

		return [sum_date, year, month, week, startTime, endTime]
	end

	#
	# Do Hourly Summary
	#
	def self.do_fleet_summary_by_hourly(domain, date, year, month, week, startTime, endTime, closingDailySummary)
		fleets = Fleet.all
		return unless fleets
		batchInterval = Setting.getIntValue('batch_interval')
		trips = Summary.find_trips(domain, startTime, endTime)

		fleets.each do |fleet|
			debug_print fleet.name
			Summary.summary_hourly_by_fleet(domain, startTime, endTime, date, year, month, week, fleet, trips, closingDailySummary)
			Summary.update_fleet_velocity(fleet, batchInterval)
		end
	end

	#
	# fleet velocity를 업데이트 
	#
	def self.update_fleet_velocity(fleet, batchInterval)
		if(fleet.velocity > 0 && fleet.trip_id && fleet.last_trip_time)
			now, last, limit = Time.now.to_i, fleet.last_trip_time.to_i, batchInterval * 60 * 60
			# Batch Interval 만큼 시간이 지났다면 ...
			if((now - last) > limit)
				fleet.velocity = 0
				fleet.save!
			end
		end		
	end

	#
	# Hourly Summary By Fleet
	#
	def self.summary_hourly_by_fleet(domain, startTime, endTime, date, year, month, week, fleet, trips, closingDailySummary)
		track_conds = { 'stm' => { '$gte' => startTime , '$lt' => endTime }, 'fid' => fleet.name }
		event_conds = { 'etm' => track_conds['stm'], 'fid' => track_conds['fid'] }

		fleetSum = FleetSummary.where("sum_day = ? and fleet_id = ?", date.strftime('%Y-%m-%d'), fleet.id).first
		unless fleetSum
			fleetSum = FleetSummary.new 
			fleetSum.fleet_id = fleet.id
			fleetSum.sum_day = date.strftime('%Y-%m-%d')
			fleetSum.sum_year = year
			fleetSum.sum_month = month
			fleetSum.sum_week = week
		end

		fleetSum.driver_id = fleet.driver_id
		fleetSum.drive_time = Summary.get_trip_time(trips, fleet, startTime, endTime)
		fleetSum.drive_dist = Summary.get_track_sum(track_conds, 'dst')
		fleetSum.impact = Summary.get_event_count(event_conds, 'G')
		fleetSum.geofence = Summary.get_event_count(event_conds, ['I', 'O'])
		fleetSum.emergency = Summary.get_event_count(event_conds, 'B')
		fleetSum.overspeed = Summary.get_event_count(event_conds, 'V')
		fleetSum.speed_off = Summary.get_speed_count(track_conds, 'c_off', 'speed_off')
		fleetSum.speed_idle = Summary.get_speed_count(track_conds, 'c_idl', 'speed_idle')
		fleetSum.speed_slow = Summary.get_speed_count(track_conds, 'c_low', 'speed_slow')
		fleetSum.speed_normal = Summary.get_speed_count(track_conds, 'c_nml', 'speed_normal')
		fleetSum.speed_high = Summary.get_speed_count(track_conds, 'c_hgh', 'speed_high')
		fleetSum.speed_over = Summary.get_speed_count(track_conds, 'c_ovr', 'speed_over')
		fleetSum.velocity = Summary.get_track_avg(track_conds, 'vlc')
		fleetSum.save!

		if(closingDailySummary)
			# fleet, driver -> Total drive_time, drive_dist 정보를 계산하여 fleet, driver에 설정 
			fleet.drive_time += fleetSum.drive_time
			fleet.drive_dist += fleetSum.drive_dist
			fleet.save!

			if(fleet.driver)
				driver = fleet.driver
				driver.work_time += fleetSum.drive_time
				driver.distance += fleetSum.drive_dist
				driver.point += fleetSum.speed_over
				driver.save!
			end
		end
	end	

	############################################################################################
	# 																	Daily Summary
	############################################################################################
	#
	# Daily Summary
	#
	def self.daily_summary
		debug_print "Daily summary start..."

		Domain.all.each do |domain|
			Summary.daily_summary_by_domain(domain) if(domain.timezone)
		end
		
		debug_print "Daily summary completed"
	end

	#
	# Daily Summary By Domain
	#
	def self.daily_summary_by_domain(domain)
		# 1. 서머리 시간 체크 
		return if(!Summary.check_summary_time(domain))
		# 2. 날짜, 년, 월, 일, 주 값을 구한다.
		date_info = Summary.get_summary_date_info(domain, ActiveSupport::TimeZone[domain.timezone].now)
		sum_date, year, month, week, startTime, endTime = date_info[0], date_info[1], date_info[2], date_info[3], date_info[4], date_info[5]
		# 3. Current Domain 설정 
		Domain.current_domain = domain
		debug_print "Domain (#{domain.name}) daily summary start..."
		# 4. Fleet 별 Daily Summary
		Summary.do_fleet_summary(domain, sum_date, year, month, week, startTime, endTime)
		# 5. Fleet Group 별 Daily Summary
		Summary.do_fleet_group_summary(domain, date, year, month, week)
		debug_print "Domain (#{domain.name}) daily summary completed"
	end

	#
	# 타임존에 따른 현재 시각을 구한다. 현재 시각이 01시인 경우 OK
	#
	def self.check_summary_time(domain)
		now = ActiveSupport::TimeZone[domain.timezone].now
		return now.hour == 1
	end

	#
	# summary date information을 리턴 
	#
	def self.get_summary_date_info(domain, now)
		# 2. 타임존에 따른 현재 시각을 구한다.
		date_format, sum_date = '%Y-%m-%d', now.to_date - 1
		# 3. 날짜, 년, 월, 일, 주 값을 구한다.
		year, month, week = sum_date.year, sum_date.month, sum_date.strftime("%U").to_i
		# 4. 시작시간 타임스탬프, 완료시간 타임스탬프를 구한다.
		startTime = ActiveSupport::TimeZone[domain.timezone].parse(sum_date.strftime(date_format)).to_time.to_i * 1000
		endTime = ActiveSupport::TimeZone[domain.timezone].parse(now.strftime(date_format)).to_time.to_i * 1000
		[sum_date, year, month, week, startTime, endTime]		
	end

	############################################################################################
	# 																	Daily Summary For Test
	############################################################################################
	#
	# Daily Summary By Date
	#
	def self.daily_summary_by_date(dateStr)
		debug_print "Daily summary start..."

		Domain.all.each do |domain|
			Summary.daily_summary_by_domain_date(domain, dateStr) if(domain.timezone)
		end
		
		debug_print "Daily summary completed"
	end

	#
	# Daily Summary By Domain By Date
	#
	def self.daily_summary_by_domain_date(domain, dateStr)
		# 2. 타임존에 따른 현재 시각을 구한다.
		now, date_format = ActiveSupport::TimeZone[domain.timezone].parse(dateStr).to_time, '%Y-%m-%d'
		# 3. 날짜, 년, 월, 일, 주 값을 구한다.
		sum_date = now.to_date
		year, month, week = sum_date.year, sum_date.month, sum_date.strftime("%U").to_i
		# 4. 시작시간 타임스탬프, 완료시간 타임스탬프를 구한다.
		startTime = ActiveSupport::TimeZone[domain.timezone].parse(sum_date.strftime(date_format)).to_time.to_i * 1000
		endTime = ActiveSupport::TimeZone[domain.timezone].parse((sum_date + 1).strftime(date_format)).to_time.to_i * 1000
		# 5. Current Domain 설정 
		Domain.current_domain = domain
		debug_print "Domain (#{domain.name}) daily summary start..."
		# 6. Fleet 별 Daily Summary
		Summary.do_fleet_summary(domain, sum_date, year, month, week, startTime, endTime)
		# 7. Fleet Group 별 Daily Summary
		Summary.do_fleet_group_summary(domain, sum_date, year, month, week)
		debug_print "Domain (#{domain.name}) daily summary completed"
	end	

	############################################################################################
	# 																	Fleet Summary
	############################################################################################

	#
	# Do Daily Summary
	#
	def self.do_fleet_summary(domain, date, year, month, week, startTime, endTime)
		fleets = Fleet.all
		return unless fleets
		
		trips = Summary.find_trips(domain, startTime, endTime)

		fleets.each do |fleet|
			debug_print fleet.name
			Summary.summary_by_fleet(domain, startTime, endTime, date, year, month, week, fleet, trips)
		end
	end

	#
	# Search trip by time
	#
	def self.find_trips(domain, startTime, endTime)
		return Trip.any_of({'dom' => domain.id, 'stm' => { '$gte' => startTime , '$lt' => endTime }}, {'etm' => { '$gte' => startTime , '$lt' => endTime }})
	end

	#
	# Daily Summary By Fleet
	#
	def self.summary_by_fleet(domain, startTime, endTime, date, year, month, week, fleet, trips)
		track_conds = { 'stm' => { '$gte' => startTime , '$lt' => endTime }, 'fid' => fleet.name }
		event_conds = { 'etm' => track_conds['stm'], 'fid' => track_conds['fid'] }

		fleetSum = FleetSummary.where("sum_day = ? and fleet_id = ?", date.strftime('%Y-%m-%d'), fleet.id).first
		unless fleetSum
			fleetSum = FleetSummary.new 
			fleetSum.fleet_id = fleet.id
			fleetSum.sum_day = date.strftime('%Y-%m-%d')
			fleetSum.sum_year = year
			fleetSum.sum_month = month
			fleetSum.sum_week = week
		end

		fleetSum.driver_id = fleet.driver_id
		fleetSum.drive_time = Summary.get_trip_time(trips, fleet, startTime, endTime)
		fleetSum.drive_dist = Summary.get_track_sum(track_conds, 'dst')
		fleetSum.impact = Summary.get_event_count(event_conds, 'G')
		fleetSum.geofence = Summary.get_event_count(event_conds, ['I', 'O'])
		fleetSum.emergency = Summary.get_event_count(event_conds, 'B')
		fleetSum.overspeed = Summary.get_event_count(event_conds, 'V')
		fleetSum.speed_off = Summary.get_speed_count(track_conds, 'c_off', 'speed_off')
		fleetSum.speed_idle = Summary.get_speed_count(track_conds, 'c_idl', 'speed_idle')
		fleetSum.speed_slow = Summary.get_speed_count(track_conds, 'c_low', 'speed_slow')
		fleetSum.speed_normal = Summary.get_speed_count(track_conds, 'c_nml', 'speed_normal')
		fleetSum.speed_high = Summary.get_speed_count(track_conds, 'c_hgh', 'speed_high')
		fleetSum.speed_over = Summary.get_speed_count(track_conds, 'c_ovr', 'speed_over')
		fleetSum.velocity = Summary.get_track_avg(track_conds, 'vlc')
		fleetSum.save!

		# fleet, driver -> Total drive_time, drive_dist 정보를 계산하여 fleet, driver에 설정 
		fleet.drive_time += fleetSum.drive_time
		fleet.drive_dist += fleetSum.drive_dist
		fleet.save!

		driver = fleet.driver
		driver.work_time += fleetSum.drive_time
		driver.distance += fleetSum.drive_dist
		driver.point += fleetSum.speed_over
		driver.save!
	end

	#
	# Trip 시간 계산 
	#
	def self.get_trip_time(trips, fleet, startTime, endTime)
		tripTime, foundTrips = 0, trips.select { |trip| trip.fid == fleet.name }
		return 0 if(!foundTrips || foundTrips.empty?)
		
		foundTrips.each do |trip|
			stm, etm = trip.stm.to_i, trip.etm.to_i
			# 1. 트립 시작 시간과 트립 완료 시간이 startTime, endTime 사이인 경우 : etm - stm
			if(startTime <= stm && endTime >= etm)
				tripTime += (etm - stm)
			# 2. 트립 시작 시간과 트립 완료 시간이 startTime, endTime을 포함하는 경우 : endTime - startTime
			elsif (startTime >= stm && endTime <= etm) 
				tripTime += (endTime - startTime)
			# 3. 트립 시작 시간이 startTime보다 이전이고 트립 완료 시간이 endTime 이전일 경우 : etm - startTime
			elsif (startTime >= stm && endTime >= etm) 
				tripTime += (etm - startTime)
			# 4. 트립 시작 시간이 startTime 이 후이고 완료 시간이 endTime보다 이 후인 경우 : endTime - stm
			elsif (startTime <= stm && endTime <= etm) 
				tripTime += (endTime - stm)
			end
		end

		tripTime = (tripTime > 0) ? tripTime : 0
		# convert to minutes
		tripTime = (tripTime / 1000.0 / 60.0).round(1)
		return tripTime
	end

	#
	# Track의 선택 필드에 대한 평균값 계산, 속도가 0인 track은 제외한다.
	#
	def self.get_track_avg(conds, field)
		conds['vlc'] = { "$gt" => 0 }
		match = { "$match" => conds }
		group = { "$group" => { "_id" => nil, "avg" => { "$avg" => "$#{field}" }} }
		result = Track.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["avg"].round(2) : 0
	end

	#
	# Track의 선택 필드에 대한 합 계산  
	#
	def self.get_track_sum(conds, field)
		match = { "$match" => conds }
		group = { "$group" => { "_id" => nil, "sum" => { "$sum" => "$#{field}" }} }
		result = Track.collection.aggregate([match, group])
		sum = (result && !result.empty?) ? result[0]["sum"] : 0
		# convert meter to kilometer
		return (sum / 1000.0).round(1)
	end

	#
	# Event의 선택 필드에 대한 카운팅 
	#
	def self.get_event_count(conds, type)
		conds['typ'] = (type.class.name == 'Array') ? { '$in' => type } : type
		match = { "$match" => conds }
		group = { "$group" => { "_id" => "id", "count" => { "$sum" => 1 }} }
		result = Event.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["count"] : 0
	end

	#
	# 속도 구간 카운팅 
	#
	def self.get_speed_count(conds, field, level)
		Summary.set_speed_cond(conds, level)
		match = { "$match" => conds }
		group = { "$group" => { "_id" => "id", "count" => { "$sum" => 1 }} }
		result = Track.collection.aggregate([match, group])
		return (result && !result.empty?) ? result[0]["count"] : 0
	end

	#
	# 속도 구간에 대한 검색 조건 값 설정 
	#
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


	############################################################################################
	# 																	Fleet Group Summary
	############################################################################################
	#
	# Daily Fleet Group Summary
	#
	def self.do_fleet_group_summary(domain, date, year, month, week)
		groups = FleetGroup.all
		return if(!groups || groups.empty?)

		groups.each do |group|
			Summary.summary_by_group(domain, date, year, month, week, group)
		end
	end

	#
	# Summary By Group
	#
	def self.summary_by_group(domain, date, year, month, week, group)
		fleetIds = Fleet.where("fleet_group_id = ?", group.id).collect { |fleet| fleet.id }
		return if (!fleetIds || fleetIds.empty?)

		groupSum = FleetGroupSummary.where("sum_day = ? and fleet_group_id = ?", date.strftime('%Y-%m-%d'), group.id).first
		unless groupSum
			groupSum = FleetGroupSummary.new 
			groupSum.fleet_group_id = group.id
			groupSum.sum_day = date.strftime('%Y-%m-%d')
			groupSum.sum_year = year
			groupSum.sum_month = month
			groupSum.sum_week = week
		end

		groupSum.velocity = 	Summary.avg_by_group(fleetIds, groupSum.sum_day, 'velocity')
		groupSum.drive_time =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'drive_time')
		groupSum.drive_dist =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'drive_dist')
		groupSum.impact =       Summary.sum_by_group(fleetIds, groupSum.sum_day, 'impact')
		groupSum.geofence =     Summary.sum_by_group(fleetIds, groupSum.sum_day, 'geofence')
		groupSum.emergency =    Summary.sum_by_group(fleetIds, groupSum.sum_day, 'emergency')
		groupSum.overspeed =    Summary.sum_by_group(fleetIds, groupSum.sum_day, 'overspeed')
		groupSum.speed_off =    Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_off')
		groupSum.speed_idle =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_idle')
		groupSum.speed_slow =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_slow')
		groupSum.speed_normal = Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_normal')
		groupSum.speed_high =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_high')
		groupSum.speed_over =   Summary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_over')
		groupSum.save!
	end

	def self.sum_by_group(fleetIds, date, field)
		sum = FleetSummary.where("fleet_id in (?) and sum_day = ?", fleetIds, date).sum(field.to_sym)
		return sum ? sum : 0
	end

	def self.avg_by_group(fleetIds, date, field)
		# TODO Track Data로 평균값 구하기
		avg = FleetSummary.where("fleet_id in (?) and sum_day = ?", fleetIds, date).average(field.to_sym)
		return avg ? avg.round(2) : 0
	end

end