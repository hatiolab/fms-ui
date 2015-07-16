class GeofenceGroupsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:geofence_group).permit(:fleet_group_id,:geofence_id,:alarm_type) ]
  end
end
