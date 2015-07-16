json.items do |json|
	json.array!(@collection) do |polygon|
json.(polygon, :id,:geofence_id,:lat,:lng)
	end
end
json.total @total_count
json.success true
