json.items do |json|
	json.array!(@collection) do |calendar_date|
		json.(calendar_date, :id, :cid, :title, :ad, :start, :end, :sys_date, :work_hours, :shift1_start, :shift1_end, :shift2_start, :shift2_end, :shift3_start, :shift3_end, :dayoff_flag)
	end
end
json.total @total_count
json.success true
