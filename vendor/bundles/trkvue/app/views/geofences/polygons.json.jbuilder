json.items do |json|
	json.array!(@collection) do |polygon|
		json.(polygon, :id,:geofence_id,:lat,:lng)
	end
end
json.success true
