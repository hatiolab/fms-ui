json.items do |json|
	json.array!(@collection) do |geofence|
json.(geofence, :id,:domain_id,:name,:description,:creator_id,:updater_id,:created_at,:updated_at)

		json.updater do
			json.id geofence.updater_id
			json.name geofence.updater ? geofence.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
