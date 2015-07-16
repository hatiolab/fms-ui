json.items do |json|
	json.array!(@collection) do |rem_trace|
		json.(rem_trace, :id,:domain_id,:name,:entity_type,:entity_id,:content,:created_at)
		json.creator do
			json.id rem_trace.creator_id
			json.name rem_trace.creator ? rem_trace.creator.name : ''
		end
	end
end
json.total @total_count
json.success true
