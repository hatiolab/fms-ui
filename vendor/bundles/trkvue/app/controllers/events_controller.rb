class EventsController < MongoController
  
  public

  def index
    if(params && params["_q"])
      if(params["_q"]["fid-eq"])
        params["_q"].delete("fleet_group_id-eq")
      else
        if(params["_q"]["fleet_group_id-eq"])
          groupId = params["_q"].delete("fleet_group_id-eq")
          fleetIds = Fleet.where("fleet_group_id = '#{groupId}'").collect { |fleet| fleet.name }
          params["_q"]["fid-in"] = fleetIds
        end
      end
    end

    results = searching(Event, params)
    @collection, @total_count, conditions = results[:items], results[:total], results[:conditions]

    if(params["type_summary"] && params["type_summary"] == 'Y')
      conditions = conditions || { "dom" => User.current_user.domain_id }
      conditions[:typ] = 'V'
      overspeedCnt = Event.all_of(conditions).count
      conditions[:typ] = 'G'
      impactCnt = Event.all_of(conditions).count
      conditions[:typ] = 'B'
      emergencyCnt = Event.all_of(conditions).count
      conditions[:typ] = { '$in' => ['I', 'O'] }
      geofenceCnt = Event.all_of(conditions).count
      @type_summary = { :geofence => geofenceCnt, :impact => impactCnt, :overspeed => overspeedCnt, :emergency => emergencyCnt }
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

  def latest_one
    lastCheckTime = params[:id]
    conds = {'dom' => User.current_user.domain_id, 'ctm' => {'$gt' => lastCheckTime}}
    conds['fid'] = params[:fid] if params[:fid]

    debug_print conds
    
    alert = Event.all_of(conds).order('ctm asc').first
    result = alert ? { :alert => alert, :driver => alert.driver } : {}

    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end

  def prev_event
    alert = Event.find(params[:id])
    prevAlert = Event.all_of({"fid" => alert.fid, "ctm" => {"$lt" => alert.ctm}}).order("ctm desc").first

    respond_to do |format|
      format.xml { render :xml => prevAlert } 
      format.json { render :json => prevAlert }
    end
  end

  def next_event
    alert = Event.find(params[:id])
    nextAlert = Event.all_of({"fid" => alert.fid, "ctm" => {"$gt" => alert.ctm}}).order("ctm asc").first

    respond_to do |format|
      format.xml { render :xml => nextAlert } 
      format.json { render :json => nextAlert }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:event).permit(:fid,:fvr,:did,:tid,:bid,:gid,:etm,:ctm,:kct,:typ,:vlc,:svr,:lat,:lng,:gx,:gy,:gz,:vdo,:f_vdo,:r_vdo,:ado) ]
  end
  
end