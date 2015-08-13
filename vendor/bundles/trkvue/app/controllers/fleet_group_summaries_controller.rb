class FleetGroupSummariesController < ResourceMultiUpdateController
  
public 
	def daily_summary
		dateStr = params[:date] ? params[:date] : (Date.today - 1).strftime('%Y-%m-%d')
		date = Date.parse(dateStr)
		year, month, week = date.year, date.month, date.strftime("%U").to_i
		startTime, endTime = date.to_time.to_i * 1000, (date + 1).to_time.to_i * 1000
		
		FleetSummary.daily_summary(date, year, month, week, startTime, endTime)
		FleetGroupSummary.daily_summary(date, year, month, week)

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
