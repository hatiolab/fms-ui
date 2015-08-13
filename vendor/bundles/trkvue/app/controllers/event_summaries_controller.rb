class EventSummariesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:event_summary).permit(:fleet_id,:sum_day,:sum_year,:sum_month,:sum_week,:impact,:geofence,:emergency,:gsensor,:overspeed) ]
  end
end
