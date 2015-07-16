json.items do |json|
	json.array!(@collection) do |calendar|
		json.(calendar, :id, :name, :description, :day1_off_flag, :day2_off_flag, :day3_off_flag, :day4_off_flag, :day5_off_flag, :day6_off_flag, :day7_off_flag, :day1_workhour, :day2_workhour, :day3_workhour, :day4_workhour, :day5_workhour, :day6_workhour, :day7_workhour)
		
		json.updated_at calendar.updated_at
		json.updater calendar.updater, :id, :name if calendar.updater

		json.created_at calendar.created_at
		json.creator calendar.creator, :id, :name if calendar.creator
	end
end

json.total @total_count
json.success true
