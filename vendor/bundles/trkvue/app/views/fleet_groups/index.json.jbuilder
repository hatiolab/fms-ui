json.items do |json|
	json.array!(@collection) do |fleet_group|
json.(fleet_group, :id,:domain_id,:name,:description,:creator_id,:updater_id,:created_at,:updated_at)

		json.creator do
			json.id fleet_group.creator_id
			json.name fleet_group.creator ? fleet_group.creator.name : ''
		end

		json.updater do
			json.id fleet_group.updater_id
			json.name fleet_group.updater ? fleet_group.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
