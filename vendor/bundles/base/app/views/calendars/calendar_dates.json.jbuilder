json.items do |json|
	json.array!(@calendar_dates) do |calendar_date|
		json.(calendar_date, :id, :cid, :title, :start, :end, :sys_date, :work_hours, :shift1_start, :shift1_end, :shift2_start, :shift2_end, :dayoff_flag)
	end
end

json.total @total_count
json.success true
