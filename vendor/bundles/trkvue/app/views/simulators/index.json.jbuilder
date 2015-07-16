json.items do |json|
	json.array!(@collection) do |simulator|
json.(simulator, :id,:domain_id,:name,:description,:type,:fleet_group_id,:fleet_id,:fleet_ver,:url,:lat,:lng,:total_count,:simulator_path_id,:velocity,:kick_counter,:gx,:gy,:gz,:event_type,:severity,:stillcut_cycle,:event_cycle,:stillcut_paths,:invoke_cycle,:movie_paths,:creator_id,:updater_id,:created_at,:updated_at)

		json.fleet_group do
			json.id simulator.fleet_group_id
			json.name simulator.fleet_group ? simulator.fleet_group.name : ''
		end
		
		json.fleet do
			json.id simulator.fleet_id
			json.name simulator.fleet ? simulator.fleet.name : ''
		end

		json.simulator_path do
			json.id simulator.simulator_path_id
			json.name simulator.simulator_path ? simulator.simulator_path.name : ''
		end

		json.updater do
			json.id simulator.updater_id
			json.name simulator.updater ? simulator.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
