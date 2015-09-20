json.items do |json|
	json.array!(@collection) do |fleet|
		json.(fleet,:id,:domain_id,:name,:device_name,:device_model,:driver_id,:car_no,:car_model,:fleet_group_id,:purchase_date,:reg_date,:lat,:lng,:status,:velocity,:sw_ver,:trip_id,:batch_id,:track_id,:last_trip_time,:creator_id,:created_at,:updater_id,:updated_at)
		
		json.car_image fleet.car_image ? fleet.car_image.url : ''

		json.driver do
			json.id fleet.driver.id
			json.code fleet.driver.code
			json.name fleet.driver.name
			json.img fleet.driver.img ? fleet.driver.img.url : ''
		end if fleet.driver
		
		json.fleet_group fleet.fleet_group, :id, :name if fleet.fleet_group
	end
end
json.total @total_count
json.success true
