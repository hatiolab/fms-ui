class SimulatorsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:simulator).permit(:name,:description,:type,:fleet_group_id,:fleet_id,:fleet_ver,:url,:lat,:lng,:total_count,:simulator_path_id,:velocity,:kick_counter,:gx,:gy,:gz,:event_type,:severity,:stillcut_cycle,:event_cycle,:stillcut_paths,:invoke_cycle,:movie_paths) ]
  end
end
