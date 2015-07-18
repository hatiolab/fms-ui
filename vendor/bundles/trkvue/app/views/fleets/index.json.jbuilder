json.items do |json|
	json.array!(@collection) do |fleet|
		json.(fleet,:id,:domain_id,:name,:device_name,:device_model,:driver_id,:car_no,:car_model,:car_image,:fleet_group_id,:purchase_date,:reg_date,:lat,:lng,:status,:velocity,:trip_id,:batch_id,:track_id,:last_trip_time,:creator_id,:created_at,:updater_id,:updated_at)
		
		json.driver fleet.driver, :id, :name if fleet.driver
		json.fleet_group fleet.fleet_group, :id, :name if fleet.fleet_group
	end
end
json.total @total_count
json.success true
