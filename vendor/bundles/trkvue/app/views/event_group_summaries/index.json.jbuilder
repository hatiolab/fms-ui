json.items do |json|
	json.array!(@collection) do |event_group_summary|
json.(event_group_summary, :id,:domain_id,:fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week,:impact,:geofence,:emergency,:gsensor,:overspeed)

		json.fleet_group do
			json.id event_group_summary.fleet_group_id
			json.name event_group_summary.fleet_group ? event_group_summary.fleet_group.name : ''
		end
	end
end
json.total @total_count
json.success true
