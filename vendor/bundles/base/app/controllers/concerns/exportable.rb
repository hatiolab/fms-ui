require 'axlsx'

module Exportable
  extend ActiveSupport::Concern

  #
  # export excel
  #
  def export_excel(resource_class, collection, params)
    entity = Entity.find_by_name(resource_class.name)
    # ExportResource가 DiyService에 등록되어 있다면 먼저 처리한다.
    export_svc, results = DiyService.find_by_name("Export#{resource_class.name}"), nil
          
    if(export_svc)
      conditions, include_arr, order_str, limit, offset = search_filter resource_class
      export_list = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
      results = export_svc.execute_service({:export_data => export_list})
    else
      raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => 'Entity') + '(' + resource_class.name + ')' unless entity
      conditions, include_arr, order_str, limit, offset = search_filter resource_class
      list = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
      results = build_export_data(entity, list)
    end
    
    return results
  end
  
  #
  # render xlsx
  #
  def render_xlsx(resource_name, collection)
    package = Axlsx::Package.new
    wb = package.workbook
    wb.add_worksheet(name: resource_name) do |sheet|
    	sheet.add_row collection.shift
      collection.each { |item| sheet.add_row item }
    end
    
    package.use_shared_strings = true
    send_data package.to_stream.read, 
              :filename => "#{resource_name}.xlsx", 
              :type => "application/vnd.openxmlformates-officedocument.spreadsheetml.sheet"
  end
  
  #
  # inline으로 rendering
  #
  def render_inline_xlsx(filename, package)
    send_data package.to_stream.read, 
              :filename => "#{filename}.xlsx", 
              :disposition => 'inline',
              :type => "application/vnd.openxmlformates-officedocument.spreadsheetml.sheet"
  end
  
  #
  # make export data
  #
  def build_export_data(entity, list)
    columns = entity.export_columns

    data_list = list.collect do |data|
      result = []

      columns.each_with_index do |column, index|
        val = data[column.name]

        if(column.ref_type.nil? || column.ref_type.empty?)
          result[index] = (val.to_s.downcase == 'true') ? 'Y' : 'N' if(column.col_type == 'boolean')
          result[index] = val.strftime(GlobalConfig.date_format) if(val && column.col_type == 'date')
          result[index] = val.strftime(GlobalConfig.datetime_format) if(val && column.col_type == 'datetime')
          
        elsif(:Entity.to_s == column.ref_type)
          val = data.send column.name.sub('_id', '')
          result[index] = val.name if val
          
        elsif(:CommonCode.to_s == column.ref_type)
          code = CommonCode.find_code(column.ref_name, val.to_s)
          result[index] = code ? code.description : val.to_s
        end
        
        result[index] = val.to_s if(result.size == index)
      end
      
      result
    end
    
    header = columns.collect do |col|
      t = Terminology.where("category = 'label' and name = ? and locale = ?", col.name, I18n.locale).first
      t ? t.display : (col.description.empty? ? col.name : col.description)
    end
    
    data_list.unshift header
    return data_list
  end
  
  #
  # make screen export data
  #
  def build_screen_export_data(list)
    keys, header, columns = [], [], list.shift
    columns.each do |key, value| 
      if(!key.empty? && 'null' != key) 
        header.push(value) 
        keys.push(key)
      end
    end

    data_list = [header]
    list.collect do |item|
      data = keys.collect { |key| item[key] }
      data_list.push(data)
    end
    
    return data_list
  end
  
end