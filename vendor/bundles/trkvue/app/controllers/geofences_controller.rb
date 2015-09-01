class GeofencesController < ResourceMultiUpdateController

public 
  #
  # GET Geofence list
  #
  def list
    select = 
      "geofences.id, geofences.name, geofences.description, 
      geofence_groups.fleet_group_id as group_id, fleet_groups.name as group_name"

    joinStr = "geofences
               left outer join geofence_groups on geofences.id = geofence_groups.geofence_id
               left outer join fleet_groups on geofence_groups.fleet_group_id = fleet_groups.id"

    condStr = ""
    if(params["_q"])
      whereParams = params["_q"]
      condStr << "geofences.name like '%#{whereParams['name-like']}%'" if(whereParams["name-like"]) 
      condStr << " and " if(!condStr.empty? && whereParams["description-like"]) 
      condStr << "geofences.description like '%#{whereParams['description-like']}%'" if(whereParams["description-like"]) 
    end

    orderStr = "geofences.name asc, fleet_groups.name asc"

    sql = Geofence.select(select).joins(joinStr).where(condStr).order(orderStr).to_sql
    geofences = Geofence.connection.select_all(sql)
    tempItems = geofences.group_by { |g| g["id"] }.collect { |key, value| value[0] }
    items = JSON.parse(tempItems.to_json)

    items.each do |item|
      groups = geofences.select { |geofence| item["id"].to_s == geofence["id"].to_s }.collect { |g| g["group_name"] }
      item["groups"] = groups.uniq.join(',')
    end
    results = { :success => true, :total => items.size, :items => items }

    respond_to do |format|
      format.xml  { render :xml => results }
      format.json { render :json => results }
    end
  end

  #
  # GET Polygons of geofence
  #
  def polygons
    geofence = Geofence.find(params[:id])
    @collection = geofence.polygons
  end
  
  #
  # POST /domains/:domain_id/geofences/:id/update_multiple_polygons
  # 
  def update_multiple_polygons
    geofence, success, msg = Geofence.find(params[:id]), true, "success"
    
    if(geofence)
      Polygon.destroy_all(:geofence_id => params[:id])
      if(params[:multiple_data] && params[:multiple_data].class.name == 'string')
        polygons = JSON.parse(params[:multiple_data])
      else
        polygons = params[:multiple_data]
      end

      polygons.each do |polygon| 
        Polygon.create! :geofence_id => polygon[:geofence_id], :lat => polygon[:lat], :lng => polygon[:lng]
      end
    else
      sucess, msg = false, "Invalid geofence id"
    end
  
    respond_to do |format|
      format.xml  { render :xml => { :success => sucess, :msg => msg } }
      format.json { render :json => { :success => sucess, :msg => msg } }
    end
  end
  
private
  def resource_params
    [ params.require(:geofence).permit(:name,:description) ]
  end
end
