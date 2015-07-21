class EventsController < MongoController
  
  public

  def index
    if(params && params["_q"])
      if(params["_q"]["fleet_group_id-eq"])
        groupId = params["_q"].delete("fleet_group_id-eq")
        fleetIds = Fleet.where("fleet_group_id = '#{groupId}'").collect { |fleet| fleet.name }
        params["_q"]["fid-in"] = fleetIds
      end
    end

    results = searching(Event, params)
    @collection, @total_count = results[:items], results[:total]

    # respond_to do |format|
    #   format.xml { render :xml => events } 
    #   format.json { render :json => events }
    # end
  end
  
  def show
    @event = Event.find(params[:id])
  end
  
  def update_multiple
    respond_to do |format|
      format.xml { render :xml => update_multiple_data(Event, params) } 
      format.json { render :json => update_multiple_data(Event, params) }
    end
  end

  def latest_one
    lastCheckTime = params[:id]
    alert = Event.all_of({'ctm' => {'$gte' => lastCheckTime}}).order('ctm asc').first
    result = alert ? { :alert => alert, :driver => alert.driver } : {}

    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:event).permit(:fid,:fvr,:did,:tid,:bid,:gid,:etm,:ctm,:kct,:typ,:vlc,:svr,:lat,:lng,:gx,:gy,:gz,:vdo,:f_vdo,:r_vdo,:ado) ]
  end
  
end