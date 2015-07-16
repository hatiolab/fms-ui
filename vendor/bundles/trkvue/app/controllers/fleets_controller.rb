class FleetsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:fleet).permit(:fleet_group,:name,:device_name,:device_model,:driver_id,:car_no,:car_model,:car_image,:fleet_group_id,:purchase_date,:reg_date,:lat,:lng,:status,:velocity,:trip_id,:batch_id,:track_id,:last_trip_time) ]
  end
end
