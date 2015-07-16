class ExpansionCodesController < ResourceMultiUpdateController
  
public
  
  #
  # POST expansion_codes/:id/update_multiple_items
  # 
  def update_multiple_items
    exp_code = ExpansionCode.find(params[:id])
    delete_list, update_list, create_list = refine_multiple_data(params[:multiple_data], 'id')

    ExpansionCodeItem.transaction do
      # 1. delete
      destroy_multiple_data(ExpansionCodeItem, delete_list)
      # 2. update
      update_multiple_data(ExpansionCodeItem, update_list, 'id', ['expansion_code_id'], {})
      # 3. create
      create_multiple_data(ExpansionCodeItem, create_list, false, 'id', ['domain_id'], {})
    end

    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :success} }
      format.json { render :json => {:success => true, :msg => :success} }
    end
  end
  
private
  def resource_params
    [ params.require(:expansion_code).permit(:name,:description) ]
  end
  
  def multi_update_attrs_to_rem
    ['items']
  end

  def multi_create_attrs_to_rem
    ['items']
  end
end
