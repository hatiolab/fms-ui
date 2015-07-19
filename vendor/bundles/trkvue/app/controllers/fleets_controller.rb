class FleetsController < ResourceMultiUpdateController
  
public 
	def trip
		fleet = Fleet.find(params[:id])
		# 1. trip
		trip = Trip.find(fleet.trip_id)
		# 2. batches
		batches = Batch.all_of({'tid' => trip.id}).order("id asc")
		# 3. tracks
		tracks = Track.all_of({'tid' => trip.id}).order("id asc")
		# 4. result
		result = {:fleet => fleet, :trip => trip, :batches => batches, :tracks => tracks, :success => true}

    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
	end

private
  def resource_params
    [ params.require(:fleet).permit(:fleet_group,:name,:device_name,:device_model,:driver_id,:car_no,:car_model,:car_image,:fleet_group_id,:purchase_date,:reg_date,:lat,:lng,:status,:velocity,:trip_id,:batch_id,:track_id,:last_trip_time) ]
  end
end
