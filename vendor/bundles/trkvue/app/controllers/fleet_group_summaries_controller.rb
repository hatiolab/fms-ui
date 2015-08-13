class FleetGroupSummariesController < ResourceMultiUpdateController
  
public 
	def daily_summary
		date = params[:date] ? params[:date] : (Date.today - 1).strftime('%Y-%m-%d')
		
		FleetGroupSummary.daily_summary(date)
		FleetSummary.daily_summary(date)
		EventGroupSummary.daily_summary(date)
		EventSummary.daily_summary(date)

		respond_to do |format|
    	format.xml  { render :xml => { :success => true, :msg => 'success' } }
    	format.json { render :json => { :success => true, :img => 'success' } }
  	end
	end
		  
private
  def resource_params
    [ params.require(:fleet_group_summary).permit(:fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:gsensor,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over) ]
  end
end
