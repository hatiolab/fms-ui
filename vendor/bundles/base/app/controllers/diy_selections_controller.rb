class DiySelectionsController < ResourceMultiUpdateController
  
  #
  # POST diy_selections/:diy_selection_id/update_multiple_parameters.json
  #
  def update_multiple_parameters
    @diySelection = DiySelection.find(params[:id])
    parameterType = params[:type]
    parameterClass = (parameterType == 'in') ? ServiceInParam : ServiceOutParam
    update_parameters(@diySelection, parameterClass)
    @service_params = (parameterType == 'in') ? @diySelection.service_in_params : @diySelection.service_out_params
  end
  
  #
  # GET diy_selections/diy_selection_name/shoot
  # 
  def query
    shoot
  end
  
  #
  # POST diy_selections/diy_selection_name/shoot
  # 
  def shoot
    diy_selection = DiySelection.find_by_name(params[:id])
    raise Hatio::Exception::ResourceNotFound, "Not Found CustomSelection Named '#{params[:id]}'" unless(diy_selection)

    params[:input] ||= params
    params[:input][:domain_id] = params[:domain_id] if params[:input][:domain_id].blank?
    result_list = diy_selection.execute_logic(params[:input])
    format_regular(result_list)
    
    if(params[:dynamic] && params[:dynamic] == 'Y') 
      result_list = convert_to_dynamic_data(diy_selection, result_list)
    end
    
    if('xls' == params[:format] || 'xlsx' == params[:format])
      result_list = (result_list.class.name == 'Hash') ? result_list[:items] : result_list
      @collection = build_export(diy_selection, result_list)
    end
    
    filename = params[:filename] ? params[:filename] : diy_selection.name
    
    respond_to do |format|
      format.xml { render :xml => result_list } 
      format.json { render :json => result_list }
      format.xls
      format.xlsx {
        render_xlsx(filename, @collection)
      }
    end
  end
  
  #
  # 클라이언트 화면에서 보내주는대로 엑셀 출력
  #
  def export_screen
    diySelection = DiySelection.find_by_name(params[:id])
    if(params[:dynamic] && params[:dynamic] == 'Y')
      @collection = build_dynamic_export(diySelection, JSON.parse(params[:xlsGridInfo]))
    else 
      @collection = build_export(diySelection, JSON.parse(params[:xlsGridInfo]))
    end
    
    file_name = params[:filename] ? params[:filename] : resource_class.name
    
    respond_to do |format|
      format.xml { render :xml => @collection } 
      format.json { render :json => @collection }
      format.xls
      format.xlsx {
        render_xlsx(file_name, @collection)
      }
    end
  end 
  
private
  def resource_params
    [ params.require(:diy_selection).permit(:name,:description,:script_type,:service_logic) ]
  end
  
  def multi_update_attrs_to_rem
    ['service_in_params', 'service_out_params']
  end
  
  def multi_create_attrs_to_rem
    ['service_in_params', 'service_out_params']
  end
  
  def update_parameters(diySelection, parameterClass)
    delete_list, update_list, create_list = refine_multiple_data(params[:multiple_data], 'id')
    parameterClass.transaction do
      # 1. delete
      destroy_multiple_data(parameterClass, delete_list)
      # 2. update
      update_multiple_data(parameterClass, update_list, 'id', [], {})
      # 3. create
      create_multiple_data(parameterClass, create_list, false, 'id', [], {})
    end
  end
  
  def build_export(diy_selection, list)
    data_list, columns = [], diy_selection.service_out_params.where("rank > 0")
    header = columns.collect { |col| (col.description && !col.description.empty?) ? col.description : col.name }
    keys = columns.collect { |col| col.name }
    
    list.each do |item|
      data = keys.collect { |key| item[key] ? item[key] : item[key.to_sym] }
      data_list.push(data)
    end
    
    return data_list
  end
  
  #
  # export dynamic report 
  #
  def build_dynamic_export(diy_selection, list)
    data_list, columns = [], diy_selection.service_out_params.where("rank > 0")
    header = columns.collect { |col| (col.description && !col.description.empty?) ? col.description : col.name }
    data_list.push(header)
    list.shift
    
    list.each do |item|
      item.delete("") if(item.key?(""))
      data = item.collect { |key, val| val }
      data_list.push(data)
    end
    
    return data_list
  end
  
  def format_regular(result)
    return unless(result.respond_to?("key?"))
    
    if(result.key?("items")) 
      items = result.delete("items")
      result[:items] = items
    end
    
    if(result.key?("success"))
      success = result.delete("success")
      result[:success] = success
    end
    
    if(result.key?("total"))
      total = result.delete("total")
      result[:total] = total
    end
  end
  
  def convert_to_dynamic_data(diy_selection, result_list)
    out_params, data_list, dynamic_data_list = diy_selection.service_out_params, [], []
    data_list = (result_list.class.name == 'Hash') ? result_list[:items] : result_list
    
    data_list.each do |result|
      dynamic_data = {}
      out_params.each_with_index { |param, idx| dynamic_data["data_#{idx + 1}"] = result[param.name] }
      dynamic_data_list.push(dynamic_data)
    end
        
    if(result_list.class.name == 'Hash')
      result_list[:items] = dynamic_data_list
    else
      result_list = dynamic_data_list
    end
    
    result_list
  end

end
