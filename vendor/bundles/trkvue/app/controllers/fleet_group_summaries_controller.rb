class FleetGroupSummariesController < ResourceMultiUpdateController
  
public
	def summary
		from_date, to_date = params[:from_date], params[:to_date]
		cond = ["(fleet_group_summaries.sum_day between ? and ?)", from_date, to_date]

		if(params[:group_id])
			cond[0] << " and fleet_group_summaries.fleet_group_id = ?"
			cond.push(params[:group_id])
		end

    select = 
    "fleet_group_summaries.fleet_group_id as group_id, 
     fleet_groups.name as group_name, 
     avg(fleet_group_summaries.velocity) as velocity, 
     sum(fleet_group_summaries.drive_time) as drive_time, 
     sum(fleet_group_summaries.drive_dist) as drive_dist"

    joinStr = 
    "fleet_group_summaries 
     INNER JOIN fleet_groups ON fleet_group_summaries.fleet_group_id = fleet_groups.id"

    groupStr = "fleet_group_summaries.fleet_group_id, fleet_groups.name"

 		orderStr = "fleet_groups.name asc"   

 		total = FleetGroupSummary.where(cond).count
    sql = FleetGroupSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).to_sql
    items = FleetGroupSummary.connection.select_all(sql)
    results = { :success => true, :total => total, :items => items }

    respond_to do |format|
    	format.xml  { render :xml => results }
    	format.json { render :json => results }
  	end
	end

	def event_summary
		
	end

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
