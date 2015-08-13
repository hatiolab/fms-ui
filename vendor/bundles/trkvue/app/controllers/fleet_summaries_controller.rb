class FleetSummariesController < ResourceMultiUpdateController

  public
  def summary
    from_date, to_date = params[:from_date], params[:to_date]
    cond = ["(fleet_summaries.sum_day between ? and ?)", from_date, to_date]

    if(params[:group_id])
      cond[0] << " and fleet_summaries.fleet_id in (select id from fleets where fleet_group_id = ?)"
      cond.push(params[:group_id])
    end

    select = 
      "fleet_summaries.fleet_id, 
      fleets.name as fleet_name, 
      avg(fleet_summaries.velocity) as velocity, 
      sum(fleet_summaries.drive_time) as drive_time, 
      sum(fleet_summaries.drive_dist) as drive_dist"

    joinStr = "fleet_summaries INNER JOIN fleets ON fleet_summaries.fleet_id = fleets.id"

    groupStr = "fleet_summaries.fleet_id, fleets.name"

    orderStr = "fleets.name asc"

    total = FleetSummary.where(cond).count
    sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).to_sql
    items = FleetSummary.connection.select_all(sql)
    results = { :success => true, :total => total, :items => items }

    respond_to do |format|
      format.xml  { render :xml => results }
      format.json { render :json => results }
    end
  end

  def event_summary
    from_date, to_date = params[:from_date], params[:to_date]
    cond = ["(fleet_summaries.sum_day between ? and ?)", from_date, to_date]

    if(params[:group_id])
      cond[0] << " and fleet_summaries.fleet_id in (select id from fleets where fleet_group_id = ?)"
      cond.push(params[:group_id])
    end

    select = 
      "fleet_summaries.fleet_id, 
      fleets.name as fleet_name, 
      sum(fleet_summaries.impact) as impact, 
      sum(fleet_summaries.overspeed) as overspeed, 
      sum(fleet_summaries.geofence) as geofence,
      sum(fleet_summaries.emergency) as emergency"

    joinStr = "fleet_summaries INNER JOIN fleets ON fleet_summaries.fleet_id = fleets.id"

    groupStr = "fleet_summaries.fleet_id, fleets.name"

    orderStr = "fleets.name asc"   

    total = FleetSummary.where(cond).count
    sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).to_sql
    items = FleetSummary.connection.select_all(sql)
    results = { :success => true, :total => total, :items => items }

    respond_to do |format|
     format.xml  { render :xml => results }
     format.json { render :json => results }
    end   
  end

 private
  def resource_params
    [ params.require(:fleet_summary).permit(:fleet_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:gsensor,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over) ]
  end

end
