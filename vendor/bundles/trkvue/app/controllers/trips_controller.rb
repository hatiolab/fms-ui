class TripsController < MongoController
  
  public

  def index
    result = searching(Trip, params)
    @collection = result[:items]
    @total_count = result[:total]
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
    tripItem = JSON.parse(trip.to_json)
    tripItem[:driver] = { :id => fleet.driver.id, :code => fleet.driver.code, :name => fleet.driver.name } if fleet.driver
    # 2. batches
    batches = Batch.all_of({'tid' => trip.id}).order("id asc")
    # 3. tracks
    tracks = Track.all_of({'tid' => trip.id}).order("id asc")
    # 4. events
    events = Event.all_of({'tid' => trip.id}).order("id asc")    
    # 5. result
    #result = {:fleet => fleet, :trip => tripItem, :batches => batches, :tracks => tracks, :events => events, :success => true}
    result = {:trip => tripItem, :batches => batches, :tracks => tracks, :events => events, :success => true}

    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end

  def prev_trip
    trip = Trip.find(params[:id])
    prevTrip = Trip.all_of({"dom" => User.current_user.domain_id, "fid" => trip.fid, "stm" => {"$lt" => trip.stm}}).order("stm desc").first

    respond_to do |format|
      format.xml { render :xml => prevTrip } 
      format.json { render :json => prevTrip }
    end
  end

  def next_trip
    trip = Trip.find(params[:id])
    nextTrip = Trip.all_of({"dom" => User.current_user.domain_id, "fid" => trip.fid, "stm" => {"$gt" => trip.stm}}).order("stm asc").first

    respond_to do |format|
      format.xml { render :xml => nextTrip } 
      format.json { render :json => nextTrip }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:trip).permit(:bid,:fid,:fvr,:did,:s_lat,:s_lng,:lat,:lng,:stm,:utm,:etm,:sts,:dst,:vlc,:a_vlc,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr) ]
  end
  
end
