json.items do |json|
	json.array!(@events) do |event|
		json.(event, :id, :ad, :cid, :shift, :sys_date, :title, :start, :end, :shift_start, :shift_end)
	end
end

json.total @total_count
json.success true
