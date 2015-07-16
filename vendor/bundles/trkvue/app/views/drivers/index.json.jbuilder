json.items do |json|
	json.array!(@collection) do |driver|
json.(driver, :id,:domain_id,:code,:name,:social_id,:email,:title,:division,:phone_no,:mobile_no,:address,:img,:creator_id,:updater_id,:created_at,:updated_at)

		json.updater do
			json.id driver.updater_id
			json.name driver.updater ? driver.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
