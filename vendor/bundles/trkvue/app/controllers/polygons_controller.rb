class PolygonsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:polygon).permit(:geofence_id,:lat,:lng) ]
  end
end
