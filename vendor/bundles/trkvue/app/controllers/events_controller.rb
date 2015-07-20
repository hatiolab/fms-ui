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

    respond_to do |format|
      format.xml { render :xml => searching(Event, params) } 
      format.json { render :json => searching(Event, params) }
    end
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
  
  private
  
  def resource_params
    [ params.require(:event).permit(:fid,:fvr,:did,:tid,:bid,:gid,:etm,:ctm,:kct,:typ,:vlc,:svr,:lat,:lng,:gx,:gy,:gz,:vdo,:f_vdo,:r_vdo,:ado) ]
  end
  
end