class EventGroupSummariesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:event_group_summary).permit(:fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week,:impact,:geofence,:emergency,:gsensor,:overspeed) ]
  end
end
