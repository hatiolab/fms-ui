class DiyServicesController < ResourceMultiUpdateController
    
  public
    
    #
    # POST domains/:domain_id/diy_services/:diy_service_id/update_multiple_parameters
    #
    def update_multiple_parameters
      @diyService = DiyService.find(params[:id])
      parameterType = params[:type]
      parameterResource = (parameterType == 'in') ? ServiceInParam : ServiceOutParam
      update_parameters(@diyService, parameterResource)
      @service_params = (parameterType == 'in') ? @diyService.service_in_params : @diyService.service_out_params
    end
    
    #
    # GET /domains/domain_id/diy_services/1/query
    #
    def query    
      execute
      
      respond_to do |format|
        format.xml { render :xml => @result_list } 
        format.json { render :json => @result_list }
        format.xls
        # TODO format.xlsx
      end
    end
    
    #
    # POST /domains/domain_id/diy_services/1/shoot
    #
    def shoot    
      execute
      
      respond_to do |format|
        format.xml { render :xml => @result_list } 
        format.json { render :json => @result_list }
        format.xls
        # TODO format.xlsx
      end
    end

  private

    def multi_update_attrs_to_rem
      ['service_in_params', 'service_out_params']
    end
    
    def multi_create_attrs_to_rem
      ['service_in_params', 'service_out_params']
    end
    
    #
    # update parameters
    #
    def update_parameters(diyService, parameterResource)
      delete_list, update_list, create_list = refine_multiple_data(params[:multiple_data], 'id')
      parameterResource.transaction do
        # 1. delete
        destroy_multiple_data(parameterResource, delete_list)
        # 2. update
        update_multiple_data(parameterResource, update_list, 'id', [], {})
        # 3. create      
        create_multiple_data(parameterResource, create_list, false, 'id', [], {})
      end
    end    
  
    def execute
      @diy_service = DiyService.find_by_name(params[:id])
      raise Hatio::Exception::ResourceNotFound, "No matching DiyService record named '#{params[:id]}'" unless(@diy_service)
      raise Hatio::Exception::ServerError, "Service '#{params[:id]} not activated!" if(!@diy_service.active_flag && params[:test].blank?)

      @result_count = 0
      params[:input] ||= params
      params[:input][:domain_id] = current_domain.id if params[:input][:domain_id].blank?
      @result_list = @diy_service.execute_service(params[:input])
    end


    def resource_params
      [ params.require(:diy_service).permit(:name,:description,:script_type,:active_flag,:service_logic,:atomic_flag) ]
    end

end
