json.items do |json|
	json.array!(@collection) do |fleet_summary|
json.(fleet_summary, :id,:domain_id,:fleet_id,:driver_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over)

		json.fleet do
			json.id fleet_summary.fleet_id
			json.name fleet_summary.fleet ? fleet_summary.fleet.name : ''
		end

		json.driver do
			json.id fleet_summary.driver_id
			json.code fleet_summary.driver ? fleet_summary.driver.code : ''
			json.name fleet_summary.driver ? fleet_summary.driver.name : ''
		end		
	end
end
json.total @total_count
json.success true
