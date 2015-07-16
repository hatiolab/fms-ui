json.items do |json|
	json.array!(@collection) do |simulator_path|
json.(simulator_path, :id,:domain_id,:name,:description,:paths,:creator_id,:updater_id,:created_at,:updated_at)

		json.updater do
			json.id simulator_path.updater_id
			json.name simulator_path.updater ? simulator_path.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
