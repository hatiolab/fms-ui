class CommonCodesController < ResourceMultiUpdateController
  
  #
  # POST /domains/:domain_id/common_codes/:id/update_multiple_codes
  # 
  def update_multiple_codes
    common_code = CommonCode.find(params[:id])
    delete_list, update_list, create_list = refine_multiple_data(params[:multiple_data], 'id')

    CommonCode.transaction do
      # 1. delete
      destroy_multiple_data(CommonCode, delete_list)
      # 2. update
      update_multiple_data(CommonCode, update_list, 'id', ['parent_id'], {})
      # 3. create
      create_multiple_data(CommonCode, create_list, true, 'id', [], {})
    end
  
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :success} }
      format.json { render :json => {:success => true, :msg => :success} }
    end
  end
  
  private
    def resource_params
      [ params.require(:common_code).permit(:name, :description, :parent_id) ]
    end
    
    def multi_update_attrs_to_rem
      ['items']
    end
  
    def multi_create_attrs_to_rem
      ['items']
    end
end
