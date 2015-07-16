class GeofencesController < ResourceMultiUpdateController

public 
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
      polygons = JSON.parse(params[:multiple_data])
      polygons.each do |polygon|
        Polygon.create!(polygon)
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
