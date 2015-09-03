class FleetSummariesController < ResourceMultiUpdateController

  public

  def summary
    from_date, to_date = params[:from_date], params[:to_date]
    sort_field, sort_value = params[:sort_field], params[:sort_value] #sort condition
    start, limit = params[:start], params[:limit]
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
      sum(fleet_summaries.drive_dist) as drive_dist,
      sum(fleet_summaries.speed_off) as speed_off,
      sum(fleet_summaries.speed_idle) as speed_idle,
      sum(fleet_summaries.speed_slow) as speed_slow,
      sum(fleet_summaries.speed_normal) as speed_normal,
      sum(fleet_summaries.speed_high) as speed_high,
      sum(fleet_summaries.speed_over) as speed_over,
      sum(fleet_summaries.impact) as impact, 
      sum(fleet_summaries.overspeed) as overspeed, 
      sum(fleet_summaries.geofence) as geofence,
      sum(fleet_summaries.emergency) as emergency"

    joinStr = "fleet_summaries INNER JOIN fleets ON fleet_summaries.fleet_id = fleets.id"

    groupStr = "fleet_summaries.fleet_id, fleets.name"

    #orderStr = "fleets.name asc"
    orderStr = "#{sort_field} #{sort_value}" # default code asc

    if(params[:limit])
      start = params[:start] ? params[:start] : 1
      sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).limit(params[:limit]).offset(start).to_sql
      items = FleetSummary.connection.select_all(sql)
      total = items.count
    else
      total = FleetSummary.where(cond).count
      sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).to_sql
      items = FleetSummary.connection.select_all(sql)
    end

    results = { :success => true, :total => total, :items => items }

    respond_to do |format|
      format.xml  { render :xml => results }
      format.json { render :json => results }
    end
  end

  def driver_summary
    from_date, to_date = params[:from_date], params[:to_date]
    sort_field, sort_value = params[:sort_field], params[:sort_value] #sort condition
    start, limit = params[:start], params[:limit]
    cond = ["(fleet_summaries.sum_day between ? and ?)", from_date, to_date]

    if(params[:driver_id])
      cond[0] << " and fleet_summaries.driver_id = ?"
      cond.push(params[:driver_id])
    end

    if(params[:group_id])
      cond[0] << " and fleet_summaries.fleet_id in (select id from fleets where fleet_group_id = ?)"
      cond.push(params[:group_id])
    end

    select = 
      "drivers.id as driver_id, 
      drivers.code as driver_code,
      drivers.name as driver_name, 
      drivers.point as point,
      sum(fleet_summaries.speed_off) as speed_off,
      sum(fleet_summaries.speed_idle) as speed_idle,
      sum(fleet_summaries.speed_slow) as speed_slow,
      sum(fleet_summaries.speed_normal) as speed_normal,
      sum(fleet_summaries.speed_high) as speed_high,
      sum(fleet_summaries.speed_over) as speed_over,
      sum(fleet_summaries.impact) as impact, 
      sum(fleet_summaries.overspeed) as overspeed, 
      sum(fleet_summaries.geofence) as geofence,
      sum(fleet_summaries.emergency) as emergency,
      avg(fleet_summaries.velocity) as velocity, 
      sum(fleet_summaries.drive_time) as drive_time, 
      sum(fleet_summaries.drive_dist) as drive_dist"

    select << ",fleet_summaries.sum_day as date" if(params[:driver_id])

    joinStr = "fleet_summaries INNER JOIN drivers ON fleet_summaries.driver_id = drivers.id"

    groupStr = "drivers.id, drivers.code, drivers.name"

    groupStr << ", sum_day" if(params[:driver_id])

  #  orderStr = "drivers.code asc"
    orderStr = "#{sort_field} #{sort_value}" # default code asc

    if(params[:limit])
      start = params[:start] ? params[:start] : 1
      sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).limit(params[:limit]).offset(start).to_sql
      items = FleetSummary.connection.select_all(sql)
      total = items.count
    else
      total = FleetSummary.where(cond).count
      sql = FleetSummary.select(select).joins(joinStr).where(cond).group(groupStr).order(orderStr).to_sql
      items = FleetSummary.connection.select_all(sql)
    end

    results = { :success => true, :total => total, :items => items }

    respond_to do |format|
     format.xml  { render :xml => results }
     format.json { render :json => results }
    end
  end

  def event_summary
    from_date, to_date = params[:from_date], params[:to_date]
    sort_field, sort_value = params[:sort_field], params[:sort_value] #sort condition
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

    orderStr = "#{sort_field} #{sort_value}" # default impact asc

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
    [ params.require(:fleet_summary).permit(:fleet_id,:driver_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:gsensor,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over) ]
  end

end
