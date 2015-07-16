json.items do |json|
	json.array!(@collection) do |shift|
		json.(shift, :id, :total_shift, :name, :default_flag, :shift1_start, :shift2_start, :shift3_start, :shift1_end, :shift2_end, :shift3_end, :shift1_start_add, :shift1_end_add, :shift2_start_add, :shift2_end_add)
	end
end
json.total @total_count
json.success true
