class TripsController < MongoController
  
  public

  def index
    respond_to do |format|
      format.xml { render :xml => searching(Trip, params) } 
      format.json { render :json => searching(Trip, params) }
    end
  end
  
  def show
    @trip = Trip.find(params[:id])
  end
  
  def update_multiple
    respond_to do |format|
      format.xml { render :xml => update_multiple_data(Trip, params) } 
      format.json { render :json => update_multiple_data(Trip, params) }
    end
  end

  def trip_set
    # 0. trip
    trip = Trip.find(params[:id])
    # 1. fleet
    fleet = Fleet.find_by_name(trip.fid)
    # 2. batches
    batches = Batch.all_of({'tid' => trip.id}).order("id asc")
    # 3. tracks
    tracks = Track.all_of({'tid' => trip.id}).order("id asc")
    # 4. events
    events = Event.all_of({'tid' => trip.id}).order("id asc")
    # 5. result
    result = {:fleet => fleet, :trip => trip, :batches => batches, :tracks => tracks, :events => events, :success => true}

    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:trip).permit(:bid,:fid,:fvr,:did,:s_lat,:s_lng,:lat,:lng,:stm,:utm,:etm,:sts,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr) ]
  end
  
end
