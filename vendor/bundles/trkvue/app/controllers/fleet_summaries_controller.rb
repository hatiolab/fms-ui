class FleetSummariesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:fleet_summary).permit(:fleet_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:gsensor,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over) ]
  end
end
