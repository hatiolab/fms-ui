class FleetsController < ResourceMultiUpdateController
  
public 
  def index
  	orConds = params["_q"].delete("or") if (params["_q"] && params["_q"]["or"])
  	conditions, include_arr, order_str, limit, offset = search_filter resource_class

    if(orConds)
    	initStr = (!conditions || conditions.empty?) ? "(" : " and ("
    	conditions = [""] if(!conditions)
  		conditions[0] << initStr
  		first_flag = true

  		0.upto(5) do |or_idx|
  			orConds["#{or_idx}"].each do |n, v|
  				condStr, condOper = n.split('-')[0], n.split('-')[1]

  				conditions[0] << " or " if(!first_flag) 
  				first_flag = false

	  			if(condOper == 'gt')
	  				conditions[0] << "#{condStr} > ?"
	  				conditions.push(v)

	  			elsif(condOper == 'gte')
	  				conditions[0] << "#{condStr} >= ?"
	  				conditions.push(v)

	  			elsif(condOper == 'lt')
	  				conditions[0] << "#{condStr} < ?"
	  				conditions.push(v)

	  			elsif(condOper == 'lte')
	  				conditions[0] << "#{condStr} <= ?"
	  				conditions.push(v)

	  			elsif(condOper == 'between')
	  				conditions[0] << "(#{condStr} > ? and #{condStr} <= ?)"
	  				v_arr = v.split(',')
	  				conditions.push(v_arr[0])
	  				conditions.push(v_arr[1])

	  			else
	  				conditions[0] << "#{condStr} = ?"
	  				conditions.push(v)
	  			end

  			end if orConds["#{or_idx}"]
  		end

			conditions[0] << ")"
    end

    @total_count = collection.where(conditions).count
    @collection = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
  end

	def trip
		fleet = Fleet.where(:id => params[:id]).first
		fleet = Fleet.where(:name => params[:id]).first unless fleet
		# 1. trip
		trip = Trip.find(fleet.trip_id)
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
    [ params.require(:fleet).permit(:fleet_group,:name,:device_name,:device_model,:driver_id,:car_no,:car_model,:car_image,:fleet_group_id,:purchase_date,:reg_date,:lat,:lng,:status,:velocity,:trip_id,:batch_id,:track_id,:last_trip_time) ]
  end
end
