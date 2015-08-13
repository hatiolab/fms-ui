class FleetGroupSummary < ActiveRecord::Base

	include Multitenant

	stampable

	validates_presence_of :fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week, :strict => true

	validates :sum_day, length: { maximum: 10 }, :strict => true

	validates :sum_year, length: { maximum: 4 }, :strict => true

	validates :sum_month, length: { maximum: 2 }, :strict => true

	validates :sum_week, length: { maximum: 3 }, :strict => true

	validates_uniqueness_of :sum_day, :strict => true, :scope => [:domain_id,:fleet_group_id]

	belongs_to :fleet_group

	#
	# Daily Summary
	#
	def self.daily_summary(date, year, month, week)
		# TODO fleet summary로 다시 계산 
		groups = FleetGroup.all
		return if(!groups || groups.empty?)

		groups.each do |group|
			FleetGroupSummary.summary_by_group(date, year, month, week, group)
		end
	end

	#
	# Summary By Group
	#
	def self.summary_by_group(date, year, month, week, group)
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

		groupSum.velocity = 		FleetGroupSummary.avg_by_group(fleetIds, groupSum.sum_day, 'velocity')
		groupSum.drive_time =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'drive_time')
		groupSum.drive_dist =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'drive_dist')
		groupSum.impact =       FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'impact')
		groupSum.geofence =     FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'geofence')
		groupSum.emergency =    FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'emergency')
		groupSum.overspeed =    FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'overspeed')
		groupSum.speed_off =    FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_off')
		groupSum.speed_idle =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_idle')
		groupSum.speed_slow =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_slow')
		groupSum.speed_normal = FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_normal')
		groupSum.speed_high =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_high')
		groupSum.speed_over =   FleetGroupSummary.sum_by_group(fleetIds, groupSum.sum_day, 'speed_over')
		groupSum.save!
	end

	def self.sum_by_group(fleetIds, date, field)
		sum = FleetSummary.where("fleet_id in (?) and sum_day = ?", fleetIds, date).sum(field.to_sym)
		return sum ? sum : 0
	end

	def self.avg_by_group(fleetIds, date, field)
		# TODO Track Data로 평균값 구하기
		avg = FleetSummary.where("fleet_id in (?) and sum_day = ?", fleetIds, date).average(field.to_sym)
		return avg ? avg : 0
	end

end