json.(@simulator, :id,:domain_id,:name,:description,:type,:fleet_group_id,:fleet_id,:fleet_ver,:url,:lat,:lng,:total_count,:simulator_path_id,:velocity,:kick_counter,:gx,:gy,:gz,:event_type,:severity,:stillcut_cycle,:event_cycle,:stillcut_paths,:invoke_cycle,:movie_paths,:created_at,:updated_at)

json.fleet_group do
	json.id @simulator.fleet_group_id
	json.name @simulator.fleet_group ? @simulator.fleet_group.name : ''
	json.description @simulator.fleet_group ? @simulator.fleet_group.description : ''
end

json.fleet do
	json.id @simulator.fleet_id
	json.name @simulator.fleet ? @simulator.fleet.name : ''
end

json.simulator_path do
	json.id @simulator.simulator_path_id
	json.name @simulator.simulator_path ? @simulator.simulator_path.name : ''
	json.description @simulator.simulator_path ? @simulator.simulator_path.description : ''
end

json.creator @simulator.creator, :id, :name if @simulator.creator
json.updater @simulator.updater, :id, :name if @simulator.updater