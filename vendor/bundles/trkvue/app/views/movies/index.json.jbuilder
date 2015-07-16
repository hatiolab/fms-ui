json.items do |json|
	json.array!(@collection) do |movie|
json.(movie, :id,:domain_id,:event_id,:total_size,:start_byte,:chunk_size,:chunk_count,:chunk_index,:file_path,:created_at)
	end
end
json.total @total_count
json.success true
